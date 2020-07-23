import React, { useState, ChangeEvent, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
} from "reactstrap";

import "./ControlPanel.css";
import * as api from "../../api";
import { setShowXray, setSpeed, togglePlaying } from "../Overlay/Overlay";
import { RootState } from "../../rootReducer";
import { ConnectedVolume } from "../Volume/Volume";
import { SpeedControl } from "../SpeedControl/SpeedControl";
import { AppState } from "../../../backend/message";

interface ControlPanelProps {
  handlePlayPause?: (e: MouseEvent) => void;
  handlePreviousRound?: (e: MouseEvent) => void;
  handleNextRound?: (e: MouseEvent) => void;
  handleToggleGameControl?: (e: MouseEvent) => void;
  handleToggleXray?: (showXray: boolean) => void;
  handleSpeedChange?: (speed: number) => void;
  handleQuit?: (e: MouseEvent) => void;
  handleQuitAndReload?: (e: MouseEvent) => void;
  handleLoadDemo?: (e: MouseEvent) => void;
  appState: AppState & { speed: number };
}
const handlePreviousRound = async (e: MouseEvent) => {
  e.stopPropagation();
  await api.goToPreviousRound();
};
const handleNextRound = async (e: MouseEvent) => {
  e.stopPropagation();
  await api.goToNextRound();
};
const handleToggleGameControl = async (e: MouseEvent) => {
  e.stopPropagation();
  if (window.require) {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("toggleGameControl");
  }
};
const handleQuit = async (e: MouseEvent) => {
  e.stopPropagation();
  if (window.require) {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("quit");
  }
};
const handleQuitAndReload = async (e: MouseEvent) => {
  e.stopPropagation();
  await api.launchStandardCsgo();

  if (window.require) {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("quit");
  }
};
const handleLoadDemo = async (e: MouseEvent) => {
  e.stopPropagation();

  if (window.require) {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("showMainWindow");
  }
};

export const ControlPanel = (props: ControlPanelProps) => {
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false);
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const toggleSpeedDropdown = () =>
    setSpeedDropdownOpen((prevState) => !prevState);
  const toggleOptionDropdown = () =>
    setOptionDropdownOpen((prevState) => !prevState);
  const toggleActionDropdown = () =>
    setActionDropdownOpen((prevState) => !prevState);

  const { handleSpeedChange, handleToggleXray, appState } = props;

  const handleChangeXray = (e: ChangeEvent<HTMLInputElement>) => {
    if (handleToggleXray) {
      handleToggleXray(e.currentTarget.checked);
    }
  };
  const handleXrayContainerClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (handleToggleXray) {
      handleToggleXray(!appState.showXray);
    }
  };
  return (
    <div
      id="control-panel"
      className="d-flex justify-content-between pt-1"
      style={{ paddingLeft: "22%", paddingRight: "22%" }}
    >
      <div className="control-panel-left">
        <i
          className={
            "fa fa-lg mx-5 " +
            (!props.appState?.demoPlaying ? "fa-play" : "fa-pause")
          }
          title="Play/Pause"
          onClick={props.handlePlayPause}
        ></i>
        {!appState.isProcessingDemo ? (
          <i
            className="fa fa-step-backward fa-lg mr-5"
            title="Previous Round"
            onClick={props.handlePreviousRound}
          ></i>
        ) : null}
        {!appState.isProcessingDemo ? (
          <i
            className="fa fa-step-forward fa-lg mr-5"
            title="Next Round"
            onClick={props.handleNextRound}
          ></i>
        ) : null}
        {appState.isProcessingDemo ? (
          <span className="mr-5">
            <Spinner
              color="primary"
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
              className="mr-2"
            />
            Analyzing Demo
          </span>
        ) : null}
        <ConnectedVolume />
      </div>
      <div className="control-panel-right">
        <i
          className="fa fa-window-restore fa-lg mr-5"
          title="Switch to Game Control"
          onClick={props.handleToggleGameControl}
        ></i>
        <Dropdown
          direction="up"
          isOpen={speedDropdownOpen}
          toggle={toggleSpeedDropdown}
        >
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={speedDropdownOpen}
          >
            <i
              className="fa fa-tachometer fa-lg mr-5"
              title="Playback Speed"
            ></i>
          </DropdownToggle>
          <DropdownMenu
            right
            className="dropdown-menu"
            id="speed-dropdown"
            modifiers={{
              offset: {
                enabled: true,
                offset: "0 10px",
              },
            }}
          >
            <SpeedControl
              speed={appState.speed}
              handleSpeedChange={handleSpeedChange}
            />
          </DropdownMenu>
        </Dropdown>
        <Dropdown
          direction="up"
          isOpen={optionDropdownOpen}
          toggle={toggleOptionDropdown}
        >
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={optionDropdownOpen}
          >
            <i className="fa fa-cog fa-lg mr-5" title="More Settings"></i>
          </DropdownToggle>
          <DropdownMenu
            right
            className="dropdown-menu"
            modifiers={{
              offset: {
                enabled: true,
                offset: "0 10px",
              },
            }}
          >
            <div
              onClick={handleXrayContainerClick}
              className="dropdown-item pt-2 pb-0 px-3 d-flex justify-content-between"
            >
              <div>Show X-Ray</div>
              <label className="custom-toggle">
                <input
                  type="checkbox"
                  checked={appState.showXray}
                  onChange={handleChangeXray}
                />
                <span className="custom-toggle-slider rounded-circle" />
              </label>
            </div>
          </DropdownMenu>
        </Dropdown>
        <Dropdown
          direction="up"
          isOpen={actionDropdownOpen}
          toggle={toggleActionDropdown}
        >
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={optionDropdownOpen}
          >
            <i className="fa fa-bars fa-lg" title="Menu"></i>
          </DropdownToggle>
          <DropdownMenu
            right
            className="dropdown-menu"
            id="action-menu"
            modifiers={{
              offset: {
                enabled: true,
                offset: "20px 10px",
              },
            }}
          >
            <div
              onClick={props.handleLoadDemo}
              className="dropdown-item py-2 px-3"
            >
              Load Demo
            </div>
            <DropdownItem divider />
            <div
              onClick={props.handleQuitAndReload}
              className="dropdown-item py-2 px-3"
            >
              Quit and Reload Game
            </div>
            <div onClick={props.handleQuit} className="dropdown-item py-2 px-3">
              Quit
            </div>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export const ConnectedControlPanel = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const dispatch = useDispatch();

  const handleTogglePlayPause = async (e: MouseEvent) => {
    e.preventDefault();

    dispatch(togglePlaying());
  };

  const handleToggleXray = async (showXray: boolean) => {
    dispatch(setShowXray(showXray));
  };

  const handleSpeedChange = async (speed: number) => {
    dispatch(setSpeed(speed));
  };

  return (
    <ControlPanel
      appState={appState}
      handlePreviousRound={handlePreviousRound}
      handleNextRound={handleNextRound}
      handleToggleGameControl={handleToggleGameControl}
      handleToggleXray={handleToggleXray}
      handlePlayPause={handleTogglePlayPause}
      handleSpeedChange={handleSpeedChange}
      handleQuit={handleQuit}
      handleQuitAndReload={handleQuitAndReload}
      handleLoadDemo={handleLoadDemo}
    />
  );
};
