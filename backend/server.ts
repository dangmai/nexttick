import Conf from "conf";
import http from "http";
import express, { Request, Response, NextFunction } from "express";
import WebSocket from "ws";
import cors from "cors";
import bodyParser from "body-parser";
import { GameState } from "csgo-gsi-types";

import commands from "./commands.json";
import {
  applyAutoexec,
  applyCommandsViaBind,
  applyCommandsViaTelnet,
  playDemo,
  launchCsgo,
} from "./console";
import { parseDemo } from "./demo";

const config = new Conf();
let currentDemo;

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

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let currentGameState: GameState;

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
interface PlayRequest {
  demoPath: string;
}

app.post("/play", async (req, res) => {
  const playRequest: PlayRequest = req.body;
  currentDemo = playRequest.demoPath;
  await applyAutoexec();
  await playDemo(config, currentDemo);

  const result = await parseDemo(currentDemo);
  console.log(result);
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

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  setInterval(() => {
    const currentTimestamp = Date.now();
    if (currentTimestamp - lastReceivedAt <= 1000) {
      ws.send(JSON.stringify(currentGameState));
    }
  }, 1000);
});

server.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
});
