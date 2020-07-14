import Conf from "conf";
import http from "http";
import express, { Request, Response, NextFunction } from "express";
import WebSocket from "ws";
import cors from "cors";
import bodyParser from "body-parser";
import { GameState } from "csgo-gsi-types";

import commands from "./commands.json";
import { getPlatformInstance } from "./platform/platform";

import {
  applyAutoexec,
  applyCommandsViaBind,
  applyCommandsViaTelnet,
  playDemo,
  launchCsgo,
} from "./console";
import { parseDemo, DemoResult } from "./demo";
import { AppState, Message } from "./message";

const config = new Conf();
const platformInstance = getPlatformInstance();
let currentDemoPath: string;
let currentGameState: GameState;
let currentDemoContent: DemoResult;
let lastTimePrevPressed: number;
let lastTimeGamePolled: number;

function setUpDefaultConfig() {
  if (!config.has("width")) {
    config.set("width", 1440);
  }
  if (!config.has("height")) {
    config.set("height", 900);
  }
}

setUpDefaultConfig();

const app = express();
let lastReceivedAt: number;
let currentAppState: AppState;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let ws: WebSocket;

app.use(cors());
app.set("port", process.env.PORT || 5001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

interface CommandRequest {
  command: keyof typeof commands;
  arguments?: string[];
}
interface SpecPlayerRequest {
  steamId: string;
}
app.post("/commands", async (req, res) => {
  const commandRequest: CommandRequest = req.body;

  if (!(commandRequest.command in commands)) {
    throw new Error(`Command type ${commandRequest.command} not supported`);
  }
  const consoleCommands = commands[commandRequest.command];
  await applyCommandsViaBind(consoleCommands);
});

app.get("/preferences", (req, res) => {
  res.send(config.store);
});

interface PreferencePostRequest {
  width: number;
  height: number;
}
app.post("/preferences", (req, res) => {
  const preference: PreferencePostRequest = req.body;
  config.set("width", preference.width);
  config.set("height", preference.height);
  res.send("Done");
});

app.post("/telnet-commands", async (req, res) => {
  const commandRequest: CommandRequest = req.body;

  if (!(commandRequest.command in commands)) {
    throw new Error(`Command type ${commandRequest.command} not supported`);
  }
  const consoleCommands = commands[commandRequest.command];
  await applyCommandsViaTelnet(consoleCommands);
  res.send("Done");
});

app.post("/spec-player", async (req, res) => {
  const request: SpecPlayerRequest = req.body;

  await applyCommandsViaTelnet(`spec_player_by_accountid ${request.steamId}`);
  res.send("Done");
});

app.post("/open-console", async (req, res) => {
  await applyCommandsViaBind("showConsole", true);
  res.send("Done");
});

interface ManualCommandRequest {
  command: string;
  type: "telnet" | "bind";
}
app.post("/manual-commands", async (req, res) => {
  const commandRequest: ManualCommandRequest = req.body;

  if (commandRequest.type === "bind") {
    await applyCommandsViaBind(commandRequest.command);
  } else {
    await applyCommandsViaTelnet(commandRequest.command);
  }
  res.send("Done");
});
const getCurrentDemoPath = async function () {
  const telnetResult = await applyCommandsViaTelnet("demo_info");
  const regexp = /Demo contents for (.*):/;
  const matches = telnetResult?.match(regexp);

  if (matches && matches.length > 1) {
    console.log(`Found current demo path: ${matches[1]}`);
    return matches[1];
  }
};
const getCurrentDemoContent = async function () {
  if (!currentDemoContent) {
    if (!currentDemoPath) {
      const demoPath = await getCurrentDemoPath();
      if (demoPath) {
        currentDemoPath = demoPath;
      }
    }
    if (currentDemoPath) {
      currentDemoContent = await parseDemo(currentDemoPath);
      console.log(currentDemoContent);
    }
  }
};
app.post("/next-round", async (req, res) => {
  await getCurrentDemoContent();
  if (currentDemoContent) {
    if (currentGameState?.map !== undefined) {
      let nextRound: number;
      if (currentGameState.map.phase === "warmup") {
        nextRound = 0;
      } else {
        nextRound = currentGameState.map.round + 1;
      }
      const nextRoundsFound = currentDemoContent.rounds.filter(
        (round) => round.roundNumber === nextRound
      );
      if (nextRoundsFound.length > 0) {
        await applyCommandsViaBind(`demo_gototick ${nextRoundsFound[0].tick}`);
      }
    }
  }
  res.send("Next Round");
});
app.post("/previous-round", async (req, res) => {
  await getCurrentDemoContent();
  if (currentDemoContent) {
    if (currentGameState?.map?.round !== undefined) {
      let previousRound: number;
      if (Date.now() - lastTimePrevPressed < 5000) {
        previousRound = currentGameState.map.round - 1;
      } else {
        previousRound = currentGameState.map.round;
      }
      const previousRoundsFound = currentDemoContent.rounds.filter(
        (round) => round.roundNumber === previousRound
      );
      if (previousRoundsFound.length > 0) {
        await applyCommandsViaBind(
          `demo_gototick ${previousRoundsFound[0].tick}`
        );
      }
    }
  }
  lastTimePrevPressed = Date.now();
  res.send("Previous Round");
});

interface VolumeRequest {
  volume: number;
}
app.post("/volume", async (req, res) => {
  const volumeRequest: VolumeRequest = req.body;
  await applyCommandsViaTelnet(`volume ${volumeRequest.volume}`);
  res.send(`Volume to set ${volumeRequest.volume}`);
});

interface PlayRequest {
  demoPath: string;
}

app.post("/play", async (req, res) => {
  const playRequest: PlayRequest = req.body;
  currentDemoPath = playRequest.demoPath;
  await applyAutoexec();
  await playDemo(config, currentDemoPath);

  currentDemoContent = await parseDemo(currentDemoPath);
  res.send("Starting demo");
});

app.post("/launch", async (req, res) => {
  await applyAutoexec();
  await launchCsgo(config);
  res.send("Launching CSGO");
});

app.post("/gsi", async (req, res) => {
  const gameState: GameState = req.body;
  currentGameState = gameState;
  lastReceivedAt = Date.now();

  const gameStateMessage: Message = {
    type: "gsi",
    gameState,
  };
  if (ws) {
    let changeMessage: Message | null = null;
    if (
      typeof gameState.allplayers !== "object" &&
      currentAppState &&
      currentAppState.demoPlaying
    ) {
      console.log("Demo not playing because allplayers not present");
      currentAppState = Object.assign({}, currentAppState, {
        demoPlaying: false,
        gameInDemoMode: false,
      });
      changeMessage = {
        type: "change",
        ...currentAppState,
      };
    } else if (!currentAppState && typeof gameState.allplayers === "object") {
      console.log(
        "Demo playing because first time receiving GSI with allplayers"
      );
      currentAppState = {
        demoPlaying: true,
        demoPath: null,
        gameInDemoMode: true,
      };
      changeMessage = {
        type: "change",
        ...currentAppState,
      };
    } else if (
      currentAppState &&
      !currentAppState.demoPlaying &&
      typeof gameState.allplayers === "object"
    ) {
      console.log("Demo playing because we are receiving GSI");
      currentAppState = Object.assign({}, currentAppState, {
        demoPlaying: true,
        gameInDemoMode: true,
      });
      changeMessage = {
        type: "change",
        ...currentAppState,
      };
    }
    if (changeMessage !== null) {
      ws.send(JSON.stringify(changeMessage));
    }
    ws.send(JSON.stringify(gameStateMessage));
  }
  res.send("Done");
});

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    status,
    message,
  });
}
app.use(errorMiddleware);

const getUpdatedAppState = async function () {
  // First check if CSGO is still running
  if (!lastTimeGamePolled || Date.now() - lastTimeGamePolled > 10000) {
    lastTimeGamePolled = Date.now();
    const isCsgoRunning = await platformInstance.isCsgoRunning();
    if (!isCsgoRunning && currentAppState && currentAppState.gameInDemoMode) {
      currentAppState = {
        demoPlaying: false,
        demoPath: null,
        gameInDemoMode: false,
      };
      console.log("Demo not playing because CSGO process is no longer running");
      const changeMessage: Message = {
        type: "change",
        ...currentAppState,
      };
      ws.send(JSON.stringify(changeMessage));
      return;
    }
    if (isCsgoRunning) {
      // Use Telnet to get updated state from CSGO
      const demoPath = await getCurrentDemoPath();
      if (demoPath && demoPath !== currentDemoPath) {
        console.log("Setting new demo path");
        currentDemoPath = demoPath;
        currentDemoContent = await parseDemo(currentDemoPath);
        console.log(currentDemoContent);
      }
    }
  }

  // Then check if GSI has stopped receiving communication
  const currentTimestamp = Date.now();
  if (
    currentTimestamp - lastReceivedAt > 1000 &&
    currentAppState?.demoPlaying
  ) {
    currentAppState = {
      demoPlaying: false,
      demoPath: null,
      gameInDemoMode: true,
    };
    console.log("Demo not playing because GSI hasn't received communication");
    const changeMessage: Message = {
      type: "change",
      ...currentAppState,
    };
    ws.send(JSON.stringify(changeMessage));
  }
};

wss.on("connection", function connection(conn) {
  console.log("Websocket connection established");
  ws = conn;
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });
  if (currentAppState) {
    ws.send(
      JSON.stringify({
        type: "change",
        ...currentAppState,
      })
    );
  }
});

setInterval(() => {
  getUpdatedAppState();
}, 1000);

server.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
});
