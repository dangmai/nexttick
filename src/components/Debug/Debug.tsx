import React, { MouseEvent, useState } from "react";
import axios from "axios";
import { GameState } from "csgo-gsi-types";
import { Button } from "reactstrap";

import { GameStateCmp } from "../GameState/GameState";

type GameStateProps = {
  gameState?: GameState;
};
export function Debug(props: GameStateProps) {
  const { gameState } = props;
  const [command, setCommand] = useState("");
  const [demoPath, setDemoPath] = useState("");

  const handleCommand = async (e: MouseEvent) => {
    e.preventDefault();
    const commandName = e.currentTarget.getAttribute("name");
    const result = await axios.post("http://localhost:5001/telnet-commands/", {
      command: commandName,
    });
    console.log(result);
  };
  const startDemo = async (e: MouseEvent) => {
    e.preventDefault();
    console.log("Starting demo");
    if (demoPath) {
      const result = await axios.post("http://localhost:5001/play/", {
        demoPath,
      });
      console.log(result);
    } else {
      console.log("No demo chosen");
    }
  };
  const launchCsgo = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await axios.post("http://localhost:5001/launch/");
    console.log(result);
  };

  const sendManualCommand = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await axios.post("http://localhost:5001/manual-commands/", {
      command,
    });
    console.log(result);
  };

  const openOverlay = async (e: MouseEvent) => {
    e.preventDefault();

    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("openOverlay");
  };
  const closeOverlay = async (e: MouseEvent) => {
    e.preventDefault();

    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("closeOverlay");
  };
  const handleChooseDemo = async (e: MouseEvent) => {
    e.preventDefault();
    await chooseDemo();
  };
  const chooseDemo = async () => {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.on("demoPath", (_event: any, arg: string) => {
      setDemoPath(arg);
    });
    ipcRenderer.send("chooseDemo");
  };

  return (
    <div className="App">
      <div className="body">
        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              type="text"
              id="inputGroupFile03"
              onClick={handleChooseDemo}
            />
            <label className="custom-file-label" htmlFor="inputGroupFile03">
              {demoPath === "" ? "Choose demo file" : demoPath}
            </label>
          </div>
        </div>
        <div className="mb-1">
          <button className="btn btn-primary" onClick={startDemo}>
            Play Demo
          </button>
          <br />
          <button className="btn btn-secondary" onClick={launchCsgo}>
            Launch CSGO
          </button>
        </div>
        <div>
          <button className="btn-secondary" onClick={openOverlay}>
            Open Overlay
          </button>
          <br />
          <button className="btn-secondary" onClick={closeOverlay}>
            Close Overlay
          </button>
        </div>
        <div>
          <button
            name="togglePause"
            className="btn btn-info"
            onClick={handleCommand}
          >
            Play/Pause
          </button>
          <button
            name="showXray"
            className="btn btn-info"
            onClick={handleCommand}
          >
            Show X-Ray
          </button>
          <button
            name="hideXray"
            className="btn btn-info"
            onClick={handleCommand}
          >
            Hide X-Ray
          </button>
          <input
            type="text"
            id="command-input"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          <button onClick={sendManualCommand}>Send Command</button>
        </div>
        <Button color="primary" type="button">
          Button
        </Button>
        <div className="game-state">
          <GameStateCmp gameState={gameState} />
        </div>
      </div>
    </div>
  );
}
