import React, { useState, ChangeEvent, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";

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

export const ControlPanel = (props: ControlPanelProps) => {
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false);
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);
  const toggleSpeedDropdown = () =>
    setSpeedDropdownOpen((prevState) => !prevState);
  const toggleOptionDropdown = () =>
    setOptionDropdownOpen((prevState) => !prevState);

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
      className="d-flex justify-content-between pb-3 pt-3"
      style={{ paddingLeft: "22%", paddingRight: "22%" }}
    >
      <div>
        <i
          className={
            "fa fa-lg mx-5 " +
            (!props.appState?.demoPlaying ? "fa-play" : "fa-pause")
          }
          title="Play/Pause"
          onClick={props.handlePlayPause}
        ></i>
        <i
          className="fa fa-step-backward fa-lg mr-5"
          title="Previous Round"
          onClick={props.handlePreviousRound}
        ></i>
        <i
          className="fa fa-step-forward fa-lg mr-5"
          title="Next Round"
          onClick={props.handleNextRound}
        ></i>
        <ConnectedVolume />
      </div>
      <div>
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
                offset: "0 20px",
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
            <i className="fa fa-cog fa-lg" title="More Settings"></i>
          </DropdownToggle>
          <DropdownMenu
            right
            className="dropdown-menu"
            modifiers={{
              offset: {
                enabled: true,
                offset: "0 20px",
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
    />
  );
};
