import React, { useRef, useEffect } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProvider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import ReconnectingWebSocket from "reconnecting-websocket";

import "fontsource-open-sans";

import "bootstrap/dist/css/bootstrap.css";
import "argon-design-system-react/src/assets/scss/argon-design-system-react.scss";
import "argon-design-system-react/src/assets/vendor/font-awesome/css/font-awesome.css";

import rootReducer from "./rootReducer";
import { Debug } from "./components/Debug/Debug";
import {
  Overlay,
  appStateSlice,
  gameStateSlice,
} from "./components/Overlay/Overlay";
import { Preferences } from "./components/Preferences/Preferences";
import { MainWindow } from "./components/MainWindow/MainWindow";

import { Message } from "../backend/message";

const store = configureStore({
  reducer: rootReducer,
});

export function App() {
  const ws = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    console.log("WebSocket hook is running");
    ws.current = new ReconnectingWebSocket("ws://localhost:5001");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    ws.current.onmessage = (e) => {
      const message: Message = JSON.parse(e.data);
      if (message.type === "gsi") {
        store.dispatch(gameStateSlice.actions.setGameState(message.gameState));
      } else {
        console.log("App received state change message");
        const { type, ...newAppState } = message;
        store.dispatch(appStateSlice.actions.setAppState(newAppState));
        if (window.require) {
          const { ipcRenderer } = window.require("electron");
          ipcRenderer.send("stateChanged", message);
        }
      }
    };
    return () => {
      ws.current?.close();
    };
  }, []);
  return (
    <ReduxProvider store={store}>
      <Router>
        <Switch>
          <Route path="/overlay">
            <Overlay />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
          <Route path="/debug">
            <Debug />
          </Route>
          <Route path="/">{<MainWindow />}</Route>
        </Switch>
      </Router>
    </ReduxProvider>
  );
}
