import React, { MouseEvent, useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";

import * as api from "../../api";

export function Debug() {
  const [command, setCommand] = useState("");

  useEffect(() => {
    document.title = "NextTick - Debug";
  }, []);
  const handleCommand = async (e: MouseEvent) => {
    e.preventDefault();
    const commandName = e.currentTarget.getAttribute("name");
    if (commandName) {
      const result = await api.sendManualCommand({
        type: "telnet",
        command: commandName,
      });
      console.log(result);
    }
  };
  const launchCsgo = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await api.launchCsgo();
    console.log(result);
  };

  const sendTelnetCommand = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await api.sendManualCommand({
      type: "telnet",
      command,
    });
    console.log(result);
  };
  const sendBindCommand = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await api.sendManualCommand({
      type: "bind",
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
                  <Button color="secondary" onClick={sendBindCommand}>
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
