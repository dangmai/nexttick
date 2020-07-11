import React, { useState, useRef, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import "fontsource-open-sans";

import { Debug } from "./components/Debug/Debug";
import { Overlay } from "./components/Overlay/Overlay";
import { Preferences } from "./components/Preferences/Preferences";
import { MainWindow } from "./components/MainWindow/MainWindow";

function App() {
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
  );
}
export default App;
