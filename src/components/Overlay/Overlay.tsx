import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  MouseEvent,
  KeyboardEvent,
} from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { GameState } from "csgo-gsi-types";

import "bootstrap/dist/css/bootstrap.css";
import "./Overlay.css";

import { ClientContext } from "../../App";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { AppState } from "../../../backend/message";
import { RootState } from "../../rootReducer";

export const appStateSlice = createSlice({
  name: "controlPanel",
  initialState: {
    demoPath: "",
    demoPlaying: true,
    gameInDemoMode: true,
    speed: 1,
    volume: 0.5,
    safezoneX: 0,
    safezoneY: 0,
    showXray: true,
  },
  reducers: {
    togglePlaying: (state) => {
      state.demoPlaying = !state.demoPlaying;
    },
    setAppState: (state, action) => {
      return Object.assign({}, state, action.payload);
    },
  },
});

type GameStateProps = {
  gameState?: GameState;
  appState?: AppState;
  handleTogglePlayPause?: (e: MouseEvent) => void;
};
export function Overlay(props: GameStateProps) {
  useEffect(() => {
    document.title = "NextTick - Overlay";
  }, []);
  const client = useContext(ClientContext);
  const [alivePlayers, setAlivePlayers] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const { gameState } = props;
  let allPlayersJson = "{}";
  if (gameState && gameState.allplayers) {
    allPlayersJson = JSON.stringify(gameState?.allplayers);
  }
  useEffect(() => {
    const allPlayers = JSON.parse(allPlayersJson);
    if (allPlayers) {
      const alivePlayers = new Array<boolean>(10);
      Object.keys(allPlayers).forEach((steamId) => {
        alivePlayers[allPlayers[steamId].observer_slot] =
          allPlayers[steamId].state.health > 0;
      });
      setAlivePlayers(alivePlayers);
    }
  }, [allPlayersJson]);
  const handleSpecPlayer = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { gameState } = props;
    const observerSlot = e.currentTarget.getAttribute("id")?.split("-")[1];

    if (!gameState || !gameState.allplayers) {
      return <div></div>;
    }
    const allPlayers = gameState.allplayers;
    const players = Object.keys(allPlayers).map((steamId) => {
      return Object.assign({}, allPlayers[steamId], { steamId: steamId });
    });
    const chosenPlayer = players.filter(
      (player) => player.observer_slot?.toString() === observerSlot
    );
    if (chosenPlayer.length > 0) {
      const steamId = chosenPlayer[0].steamId;
      await client.post("/spec-player/", {
        steamId,
      });
    }
  };
  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.keyCode === 9 && !e.repeat) {
      e.preventDefault();
      console.log("Tab held");
      await client.post("/telnet-commands/", {
        command: "showScoreboard",
      });
    }
  };
  const handleKeyUp = async (e: KeyboardEvent) => {
    if (e.keyCode === 9) {
      console.log("Tab unheld");
      await client.post("/telnet-commands/", {
        command: "hideScoreboard",
      });
    }
    if (e.keyCode === 192) {
      console.log("Backtick pressed");
      await client.post("/open-console/");
    }
  };
  const handlePreviousRound = async (e: MouseEvent) => {
    e.stopPropagation();
    await client.post("/previous-round");
  };
  const handleNextRound = async (e: MouseEvent) => {
    e.stopPropagation();
    await client.post("/next-round");
  };
  const handleVolumeChange = async (volume: number) => {
    await client.post("/volume", { volume });
  };
  const handleToggleGameControl = async (e: MouseEvent) => {
    e.stopPropagation();
    if (window.require) {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send("toggleGameControl");
    }
  };
  const handleSpeedChange = useCallback(async (speed: number) => {
    console.log(`New speed detected ${speed}`);
    await client.post("/speed", { speed });
  }, []);
  const handleToggleXray = async (showXray: boolean) => {
    let command = "showXray";
    if (!showXray) {
      command = "hideXray";
    }
    await client.post("/telnet-commands", {
      command,
    });
  };

  return (
    <div
      className={"frame " + (process.env.REACT_APP_DEBUG ? "debug-img" : "")}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      <div className="overlay" onClick={props.handleTogglePlayPause}>
        <div
          className="observer-slot"
          style={!alivePlayers[1] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-1"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[2] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-2"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[3] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-3"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[4] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-4"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[5] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-5"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[6] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-6"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[7] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-7"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[8] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-8"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[9] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-9"
        ></div>
        <div
          className="observer-slot"
          style={!alivePlayers[0] ? { display: "none" } : {}}
          onClick={handleSpecPlayer}
          id="observer-0"
        ></div>
      </div>
      <div style={{ position: "absolute", bottom: 0, width: "inherit" }}>
        <ControlPanel
          handlePreviousRound={handlePreviousRound}
          handleNextRound={handleNextRound}
          handlePlayPause={props.handleTogglePlayPause}
          handleToggleGameControl={handleToggleGameControl}
          handleToggleXray={handleToggleXray}
          handleVolumeChange={handleVolumeChange}
          handleSpeedChange={handleSpeedChange}
          appState={props.appState}
        />
      </div>
    </div>
  );
}

type ConnectedGameStateProps = {
  gameState?: GameState;
};
export function ConnectedOverlay(props: ConnectedGameStateProps) {
  const client = useContext(ClientContext);
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);

  const handleTogglePlayPause = async (e: MouseEvent) => {
    e.preventDefault();

    dispatch(appStateSlice.actions.togglePlaying());
    await client.post("/manual-commands", {
      command: "demo_togglepause",
      type: "bind",
    });
  };
  return (
    <Overlay
      {...props}
      appState={appState}
      handleTogglePlayPause={handleTogglePlayPause}
    />
  );
}
