import React, { useEffect, MouseEvent, KeyboardEvent } from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameState } from "csgo-gsi-types";

import "bootstrap/dist/css/bootstrap.css";
import "./Overlay.css";

import * as api from "../../api";
import { ConnectedPlayerControl } from "../PlayerControl/PlayerControl";
import { ConnectedControlPanel } from "../ControlPanel/ControlPanel";
import { AppState } from "../../../backend/message";
import { AppThunk } from "../../store";

export const appStateSlice = createSlice({
  name: "appState",
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
    togglePlayingState: (state) => {
      state.demoPlaying = !state.demoPlaying;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setAppState: (state, action) => {
      return Object.assign({}, state, action.payload);
    },
  },
});

export interface PlayerState {
  steamId: string;
  health: number;
}
const initialGameState: PlayerState[] = [];
export const gameStateSlice = createSlice({
  name: "gameState",
  initialState: initialGameState,
  reducers: {
    setGameState: (state, action: PayloadAction<GameState>) => {
      const allPlayers = action.payload.allplayers;
      if (!allPlayers) {
        return [];
      }

      const playerList = Object.keys(allPlayers).map((steamId) => {
        return Object.assign({}, allPlayers[steamId], { steamId: steamId });
      });

      return playerList.reduce((players, player) => {
        players[player.observer_slot] = {
          steamId: player.steamId,
          health: player.state.health,
        };
        return players;
      }, new Array<PlayerState>(10));
    },
  },
});

export const togglePlaying = (): AppThunk => async (dispatch) => {
  dispatch(appStateSlice.actions.togglePlayingState());
  await api.togglePause();
};

const handleKeyDown = async (e: KeyboardEvent) => {
  if (e.keyCode === 9 && !e.repeat) {
    e.preventDefault();
    console.log("Tab held");
    await api.showScoreboard();
  }
};
const handleKeyUp = async (e: KeyboardEvent) => {
  if (e.keyCode === 9) {
    console.log("Tab unheld");
    await api.hideScoreboard();
  }
  if (e.keyCode === 192) {
    console.log("Backtick pressed");
    await api.openConsole();
  }
};

interface OverlayProps {
  appState?: AppState;
  handleTogglePlayPause?: (e: MouseEvent) => void;
}
export function Overlay(props: OverlayProps) {
  useEffect(() => {
    document.title = "NextTick - Overlay";
  }, []);

  return (
    <div
      className={"frame " + (process.env.REACT_APP_DEBUG ? "debug-img" : "")}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      <ConnectedPlayerControl />
      <div style={{ position: "absolute", bottom: 0, width: "inherit" }}>
        <ConnectedControlPanel />
      </div>
    </div>
  );
}
