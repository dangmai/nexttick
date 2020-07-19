import React, {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  MouseEvent,
} from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";

import "./ControlPanel.css";
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
  appState?: AppState;
}
function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
export const ControlPanel = (props: ControlPanelProps) => {
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false);
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);
  const [showXray, setShowXray] = useState(true);
  const [speed, setSpeed] = useState(1);
  const toggleSpeedDropdown = () =>
    setSpeedDropdownOpen((prevState) => !prevState);
  const toggleOptionDropdown = () =>
    setOptionDropdownOpen((prevState) => !prevState);

  const { handleSpeedChange, appState } = props;
  const previousGameShowXray = usePrevious(appState?.showXray);

  if (
    props.appState?.showXray !== undefined &&
    props.appState.showXray !== previousGameShowXray &&
    props.appState.showXray !== showXray
  ) {
    setShowXray(props.appState?.showXray);
  }

  useEffect(() => {
    if (handleSpeedChange) {
      handleSpeedChange(speed);
    }
  }, [handleSpeedChange, speed]);

  const handleChangeXray = (e: ChangeEvent<HTMLInputElement>) => {
    setShowXray(e.currentTarget.checked);
  };
  const handleXrayContainerClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowXray(!showXray);
    if (props.handleToggleXray) {
      props.handleToggleXray(!showXray);
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
              speed={speed}
              handleSpeedChange={(newSpeed) => {
                setSpeed(newSpeed);
              }}
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
                  checked={showXray}
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
