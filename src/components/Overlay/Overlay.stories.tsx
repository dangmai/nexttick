import React, { FunctionComponent } from "react";
import { withKnobs, boolean } from "@storybook/addon-knobs";

import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProvider } from "react-redux";
import axios from "axios";

import { Overlay } from "./Overlay";
import { Websocket } from "../Websocket/Websocket";
import rootReducer from "../../rootReducer";

import "bootstrap/dist/css/bootstrap.css";
import "argon-design-system-react/src/assets/scss/argon-design-system-react.scss";
import "argon-design-system-react/src/assets/vendor/font-awesome/css/font-awesome.css";

const store = configureStore({
  reducer: rootReducer,
});

const initialGameState = {
  allplayers: {
    "1": {
      observer_slot: 1,
      state: {
        health: 100,
      },
    },
    "2": {
      observer_slot: 2,
      state: {
        health: 100,
      },
    },
    "3": {
      observer_slot: 3,
      state: {
        health: 100,
      },
    },
    "4": {
      observer_slot: 4,
      state: {
        health: 100,
      },
    },
    "5": {
      observer_slot: 5,
      state: {
        health: 100,
      },
    },
    "6": {
      observer_slot: 6,
      state: {
        health: 100,
      },
    },
    "7": {
      observer_slot: 7,
      state: {
        health: 100,
      },
    },
    "8": {
      observer_slot: 8,
      state: {
        health: 100,
      },
    },
    "9": {
      observer_slot: 9,
      state: {
        health: 100,
      },
    },
    "10": {
      observer_slot: 0,
      state: {
        health: 100,
      },
    },
  },
};
const gameStateWithDeadPlayers = {
  allplayers: {
    "1": {
      observer_slot: 1,
      state: {
        health: 0,
      },
    },
    "2": {
      observer_slot: 2,
      state: {
        health: 100,
      },
    },
    "3": {
      observer_slot: 3,
      state: {
        health: 90,
      },
    },
    "4": {
      observer_slot: 4,
      state: {
        health: 100,
      },
    },
    "5": {
      observer_slot: 5,
      state: {
        health: 100,
      },
    },
    "6": {
      observer_slot: 6,
      state: {
        health: 100,
      },
    },
    "7": {
      observer_slot: 7,
      state: {
        health: 100,
      },
    },
    "8": {
      observer_slot: 8,
      state: {
        health: 0,
      },
    },
    "9": {
      observer_slot: 9,
      state: {
        health: 100,
      },
    },
    "10": {
      observer_slot: 0,
      state: {
        health: 0,
      },
    },
  },
};

const sendNewGameState = (gameState: any) => {
  axios.post("http://localhost:5001/ws/gamestate/", gameState);
};
const WebsocketWithKnobs: FunctionComponent = (props) => {
  const gameState = boolean("With dead players", false)
    ? gameStateWithDeadPlayers
    : initialGameState;

  return (
    <Websocket onConnectionOpened={() => sendNewGameState(gameState)}>
      {props.children}
    </Websocket>
  );
};

export default {
  component: Overlay,
  title: "Overlay",
  decorators: [
    (storyFn: typeof Overlay, context: any) => (
      <ReduxProvider store={store}>
        <WebsocketWithKnobs>{withKnobs(storyFn, context)}</WebsocketWithKnobs>
      </ReduxProvider>
    ),
  ],
};

export const OverlayIn169 = () => (
  <div style={{ position: "relative", width: "1920px", height: "1080px" }}>
    <img alt="CSGO" src="https://i.imgur.com/5NhVGB1.png" />
    <Overlay />
  </div>
);
OverlayIn169.story = {
  name: "Overlay in 16:9 (1920x1080)",
};

export const OverlayIn169_2 = () => (
  <div style={{ position: "relative", width: "3840px", height: "2160px" }}>
    <img alt="CSGO" src="https://i.imgur.com/OS0EHHg.jpg" />
    <Overlay />
  </div>
);
OverlayIn169_2.story = {
  name: "Overlay in 16:9 (3840x2160)",
};

export const OverlayIn1610 = () => (
  <div style={{ position: "relative", width: "1440px", height: "900px" }}>
    <img alt="CSGO" src="https://i.imgur.com/rAOwJ80.png" />
    <Overlay />
  </div>
);
OverlayIn1610.story = {
  name: "Overlay in 16:10 (1440x900)",
};

export const OverlayIn43 = () => (
  <div style={{ position: "relative", width: "1280px", height: "960px" }}>
    <img alt="CSGO" src="https://i.imgur.com/doEASH0.png" />
    <Overlay />
  </div>
);
OverlayIn43.story = {
  name: "Overlay in 4:3 (1280x960)",
};
