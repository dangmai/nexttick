import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { GameState } from "csgo-gsi-types";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";

import { ClientContext } from "../../App";
import { GameStateCmp } from "../GameState/GameState";

type GameStateProps = {
  gameState?: GameState;
};
export function Debug(props: GameStateProps) {
  const { gameState } = props;
  const [command, setCommand] = useState("");

  const client = useContext(ClientContext);
  useEffect(() => {
    document.title = "NextTick - Debug";
  }, []);
  const handleCommand = async (e: MouseEvent) => {
    e.preventDefault();
    const commandName = e.currentTarget.getAttribute("name");
    const result = await client.post("/telnet-commands/", {
      command: commandName,
    });
    console.log(result);
  };
  const launchCsgo = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await client.post("/launch/");
    console.log(result);
  };

  const sendTelnetCommand = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await client.post("/manual-commands/", {
      command,
      type: "telnet",
    });
    console.log(result);
  };
  const sendManualCommand = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await client.post("/manual-commands/", {
      command,
      type: "bind",
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

  return (
    <div className="App">
      <div className="body">
        <div>
          <Form role="form">
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <Input
                  placeholder="Custom Command"
                  id="custom-command-input"
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                />
                <InputGroupAddon addonType="append">
                  <Button color="secondary" onClick={sendTelnetCommand}>
                    Send via Telnet
                  </Button>
                  <Button color="secondary" onClick={sendManualCommand}>
                    Send via Bind
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Form>
        </div>
        <div className="mb-1">
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
        </div>
      </div>
    </div>
  );
}
