import React, {
  useEffect,
  useState,
  useRef,
  RefObject,
  MouseEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "nouislider";

import "./Volume.css";
import { appStateSlice } from "../Overlay/Overlay";
import { RootState } from "../../rootReducer";
import * as api from "../../api";

interface VolumeProps {
  handleVolumeChange?: (volume: number) => void;
  handleToggleMute?: (e: MouseEvent) => void;
  volume: number;
}
export const Volume = (props: VolumeProps) => {
  const { volume, handleVolumeChange } = props;
  const [muted, setMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(0);
  const volumeSliderRef: RefObject<HTMLDivElement> = useRef(null);
  const volumeSlider = useRef<Slider.noUiSlider | null>(null);

  const handleToggleMute = (e: MouseEvent) => {
    let newVolume;
    if (muted) {
      newVolume = volumeBeforeMute;
      setMuted(false);
    } else {
      newVolume = 0;
      setMuted(true);
      const currentVolume = volumeSlider.current?.get();
      if (currentVolume && typeof currentVolume === "string") {
        setVolumeBeforeMute(parseFloat(currentVolume));
      }
    }
    volumeSlider.current?.set(newVolume);
    if (handleVolumeChange) {
      handleVolumeChange(newVolume);
    }
  };
  useEffect(() => {
    if (volumeSliderRef.current && !volumeSlider.current) {
      volumeSlider.current = Slider.create(volumeSliderRef.current, {
        start: [0.5],
        connect: [true, false],
        step: 0.01,
        range: { min: 0, max: 1 },
      });
      volumeSlider.current.on("change", (e) => {
        const newVolume = parseFloat(e[0]);
        if (newVolume === 0) {
          setMuted(true);
        } else {
          setMuted(false);
        }
        if (handleVolumeChange) {
          handleVolumeChange(newVolume);
        }
      });
    }
    volumeSlider?.current?.set(volume);
  }, [handleVolumeChange, volume]);

  return (
    <>
      <i
        className={
          "fa fa-lg mr-3 " + (muted ? "fa-volume-off" : "fa-volume-up")
        }
        style={{ width: "20px" }}
        title="Volume"
        onClick={handleToggleMute}
      ></i>
      <div className="slider" id="volume-slider" ref={volumeSliderRef} />
    </>
  );
};

export const ConnectedVolume = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const dispatch = useDispatch();

  const handleVolumeChange = async (volume: number) => {
    dispatch(appStateSlice.actions.setVolume(volume));
    await api.setVolume(volume);
  };
  return (
    <Volume volume={appState.volume} handleVolumeChange={handleVolumeChange} />
  );
};
