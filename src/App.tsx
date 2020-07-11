import React, { useState, useRef, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import axios from "axios";

import "fontsource-open-sans";

import "bootstrap/dist/css/bootstrap.css";
import "argon-design-system-react/src/assets/scss/argon-design-system-react.scss";

import { Debug } from "./components/Debug/Debug";
import { Overlay } from "./components/Overlay/Overlay";
import { Preferences } from "./components/Preferences/Preferences";
import { MainWindow } from "./components/MainWindow/MainWindow";

const clientInstance = axios.create({
  baseURL: "http://localhost:5001",
});

export const ClientContext = React.createContext(clientInstance);

export function App() {
  const [gameState, setGameState] = useState();
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    console.log("WebSocket hook is running");
    ws.current = new WebSocket("ws://localhost:5001");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setGameState(message);
    };
    return () => {
      ws.current?.close();
    };
  }, []);
  return (
    <ClientContext.Provider value={clientInstance}>
      <Router>
        <Switch>
          <Route path="/overlay">
            <Overlay gameState={gameState} />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
          <Route path="/debug">
            <Debug gameState={gameState} />
          </Route>
          <Route path="/">{<MainWindow />}</Route>
        </Switch>
      </Router>
    </ClientContext.Provider>
  );
}
