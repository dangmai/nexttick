import React, { useRef, useState, MouseEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../rootReducer";
import { togglePlaying, PlayerState } from "../Overlay/Overlay";
import "./PlayerControl.css";
import * as api from "../../api";

interface PanelPosition {
  top: number;
  width: number;
  height: number;
}
interface PlayerControlProps {
  handleTogglePlayPause?: (e: MouseEvent) => void;
  handleSpecPlayer?: (e: MouseEvent) => void;
  players?: PlayerState[];
}
export const PlayerControl = (props: PlayerControlProps) => {
  const { players } = props;
  const [panelPositions, setPanelPositions] = useState<PanelPosition[]>(
    new Array(5)
  );
  const frameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleResize = () => {
      if (!frameRef.current) {
        return;
      }
      const positions = new Array<PanelPosition>(5);
      const frameHeight = frameRef.current.offsetHeight;
      const panelHeight = frameHeight * 0.055;
      const panelWidth = frameHeight / 3.375;
      const panelMargin = frameHeight * 0.0025;
      for (let index = 0; index < 5; index++) {
        positions[index] = {
          top:
            index === 0
              ? frameHeight / 2 + frameHeight * 0.001
              : positions[index - 1].top + panelHeight + panelMargin,
          width: panelWidth,
          height: panelHeight,
        };
      }
      setPanelPositions(positions);
    };
    if (!frameRef.current) {
      return;
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  if (!players || players.length < 10) {
    return (
      <div
        ref={frameRef}
        className="player-control"
        onClick={props.handleTogglePlayPause}
      ></div>
    );
  }
  return (
    <div
      ref={frameRef}
      className="player-control"
      onClick={props.handleTogglePlayPause}
    >
      <div
        className="observer-slot"
        style={
          !players[1] || players[1].health === 0 || !panelPositions[0]
            ? { display: "none" }
            : {
                top: `${panelPositions[0].top}px`,
                width: `${panelPositions[0].width}px`,
                height: `${panelPositions[0].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-1"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[2] || players[2].health === 0 || !panelPositions[1]
            ? { display: "none" }
            : {
                top: `${panelPositions[1].top}px`,
                width: `${panelPositions[1].width}px`,
                height: `${panelPositions[1].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-2"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[3] || players[3].health === 0 || !panelPositions[2]
            ? { display: "none" }
            : {
                top: `${panelPositions[2].top}px`,
                width: `${panelPositions[2].width}px`,
                height: `${panelPositions[2].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-3"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[4] || players[4].health === 0 || !panelPositions[3]
            ? { display: "none" }
            : {
                top: `${panelPositions[3].top}px`,
                width: `${panelPositions[3].width}px`,
                height: `${panelPositions[3].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-4"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[5] || players[5].health === 0 || !panelPositions[4]
            ? { display: "none" }
            : {
                top: `${panelPositions[4].top}px`,
                width: `${panelPositions[4].width}px`,
                height: `${panelPositions[4].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-5"
      ></div>
      <div
        className="observer-slot observer-slot-right"
        style={
          !players[6] || players[6].health === 0 || !panelPositions[0]
            ? { display: "none" }
            : {
                top: `${panelPositions[0].top}px`,
                width: `${panelPositions[0].width}px`,
                height: `${panelPositions[0].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-6"
      ></div>
      <div
        className="observer-slot observer-slot-right"
        style={
          !players[7] || players[7].health === 0 || !panelPositions[1]
            ? { display: "none" }
            : {
                top: `${panelPositions[1].top}px`,
                width: `${panelPositions[1].width}px`,
                height: `${panelPositions[1].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-7"
      ></div>
      <div
        className="observer-slot observer-slot-right"
        style={
          !players[8] || players[8].health === 0 || !panelPositions[2]
            ? { display: "none" }
            : {
                top: `${panelPositions[2].top}px`,
                width: `${panelPositions[2].width}px`,
                height: `${panelPositions[2].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-8"
      ></div>
      <div
        className="observer-slot observer-slot-right"
        style={
          !players[9] || players[9].health === 0 || !panelPositions[3]
            ? { display: "none" }
            : {
                top: `${panelPositions[3].top}px`,
                width: `${panelPositions[3].width}px`,
                height: `${panelPositions[3].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-9"
      ></div>
      <div
        className="observer-slot observer-slot-right"
        style={
          !players[0] || players[0].health === 0 || !panelPositions[4]
            ? { display: "none" }
            : {
                top: `${panelPositions[4].top}px`,
                width: `${panelPositions[4].width}px`,
                height: `${panelPositions[4].height}px`,
              }
        }
        onClick={props.handleSpecPlayer}
        id="observer-0"
      ></div>
    </div>
  );
};

export const ConnectedPlayerControl = () => {
  const players = useSelector((state: RootState) => state.gameState);
  const dispatch = useDispatch();

  const handleSpecPlayer = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const observerSlot = e.currentTarget.getAttribute("id")?.split("-")[1];
    if (observerSlot) {
      await api.specPlayer(players[parseInt(observerSlot)].steamId);
    }
  };

  return (
    <PlayerControl
      handleTogglePlayPause={() => dispatch(togglePlaying())}
      handleSpecPlayer={handleSpecPlayer}
      players={players}
    />
  );
};
