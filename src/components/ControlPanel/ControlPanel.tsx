import React, {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  RefObject,
  MouseEvent,
} from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import Slider from "nouislider";

import "./ControlPanel.css";
import { SpeedControl } from "../SpeedControl/SpeedControl";
import { AppState } from "../../../backend/message";

interface ControlPanelProps {
  handlePlayPause?: (e: MouseEvent) => void;
  handlePreviousRound?: (e: MouseEvent) => void;
  handleNextRound?: (e: MouseEvent) => void;
  handleToggleGameControl?: (e: MouseEvent) => void;
  handleToggleXray?: (showXray: boolean) => void;
  handleVolumeChange?: (volume: number) => void;
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
  const [muted, setMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(0);
  const [speed, setSpeed] = useState(1);
  const toggleSpeedDropdown = () =>
    setSpeedDropdownOpen((prevState) => !prevState);
  const toggleOptionDropdown = () =>
    setOptionDropdownOpen((prevState) => !prevState);

  const { handleVolumeChange, handleSpeedChange, appState } = props;
  const volumeSliderRef: RefObject<HTMLDivElement> = useRef(null);
  const volumeSlider = useRef<Slider.noUiSlider | null>(null);
  const previousGameVolume = usePrevious(appState?.volume);
  const previousGameShowXray = usePrevious(appState?.showXray);

  let gameVolume: number | undefined = appState?.volume;
  if (
    props.appState?.showXray !== undefined &&
    props.appState.showXray !== previousGameShowXray &&
    props.appState.showXray !== showXray
  ) {
    setShowXray(props.appState?.showXray);
  }

  useEffect(() => {
    if (volumeSliderRef.current && !volumeSlider.current) {
      volumeSlider.current = Slider.create(volumeSliderRef.current, {
        start: [0.5],
        connect: [true, false],
        step: 0.01,
        range: { min: 0, max: 1 },
      });
      volumeSlider.current.on("set", (e) => {
        if (parseFloat(e[0]) === 0) {
          setMuted(true);
        } else {
          setMuted(false);
        }
        if (handleVolumeChange) {
          handleVolumeChange(e[0]);
        }
      });
    }
    const appVolumeStr = volumeSlider.current?.get();
    let appVolume;
    if (appVolumeStr && typeof appVolumeStr === "string") {
      appVolume = parseFloat(appVolumeStr);
    }
    if (
      gameVolume !== undefined &&
      gameVolume !== appVolume &&
      gameVolume !== previousGameVolume &&
      volumeSlider.current
    ) {
      volumeSlider.current.set(gameVolume);
    }
  }, [handleVolumeChange, gameVolume, previousGameVolume]);

  useEffect(() => {
    if (handleSpeedChange) {
      handleSpeedChange(speed);
    }
  }, [handleSpeedChange, speed]);

  const handleToggleMute = (e: MouseEvent) => {
    if (muted) {
      setMuted(false);
      volumeSlider.current?.set(volumeBeforeMute);
    } else {
      setMuted(true);
      const currentVolume = volumeSlider.current?.get();
      if (currentVolume && typeof currentVolume === "string") {
        setVolumeBeforeMute(parseFloat(currentVolume));
      }
      volumeSlider.current?.set(0);
    }
  };
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
        <i
          className={
            "fa fa-lg mr-3 " + (muted ? "fa-volume-off" : "fa-volume-up")
          }
          style={{ width: "20px" }}
          title="Volume"
          onClick={handleToggleMute}
        ></i>
        <div className="slider" id="volume-slider" ref={volumeSliderRef} />
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
