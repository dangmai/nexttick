import React, { MouseEvent, useEffect, useRef, RefObject } from "react";
import { Button, ButtonGroup } from "reactstrap";
import Slider from "nouislider";

import "./SpeedControl.css";

interface SpeedControlProps {
  handleSpeedChange?: (e: number) => void;
  speed: number;
}

export const SpeedControl = (props: SpeedControlProps) => {
  const { speed, handleSpeedChange } = props;
  const speedSliderRef: RefObject<HTMLDivElement> = useRef(null);
  const speedSlider = useRef<Slider.noUiSlider | null>(null);

  useEffect(() => {
    if (speedSliderRef.current && !speedSlider.current) {
      speedSlider.current = Slider.create(speedSliderRef.current, {
        start: [speed],
        connect: [true, false],
        range: {
          min: [0.25],
          "25%": [1],
          max: [10],
        },
        pips: {
          mode: "range",
          density: 10,
        },
      });
      speedSlider.current.on("set", (e) => {
        if (handleSpeedChange) {
          handleSpeedChange(e[0]);
        }
      });
    }
    speedSlider.current?.set(speed);
  }, [handleSpeedChange, speed]);

  const handleManualSpeed = (newSpeed: number) => (e: MouseEvent) => {
    e.preventDefault();
    if (handleSpeedChange) {
      handleSpeedChange(newSpeed);
    }
  };

  return (
    <div id="speed-control" className="pt-2 pb-2 px-3">
      <ButtonGroup>
        <Button onClick={handleManualSpeed(0.25)}>1/4x</Button>
        <Button onClick={handleManualSpeed(0.5)}>1/2x</Button>
        <Button onClick={handleManualSpeed(1)}>1x</Button>
        <Button onClick={handleManualSpeed(2)}>2x</Button>
        <Button onClick={handleManualSpeed(4)}>4x</Button>
      </ButtonGroup>
      <div>
        <div className="slider" id="speed-slider" ref={speedSliderRef} />
      </div>
    </div>
  );
};
