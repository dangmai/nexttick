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
    return <div ref={frameRef} className="player-control"></div>;
  }
  const generateSlot = (slotNumber: number, isRightSlot = false) => {
    const panelSlotNumber = slotNumber === 0 ? 4 : (slotNumber - 1) % 5;
    return (
      <div
        className={
          "observer-slot " +
          (isRightSlot ? "observer-slot-right " : "") +
          (players[slotNumber] && players[slotNumber].health === 0
            ? "observer-slot-dead"
            : "")
        }
        style={
          !players[slotNumber] || !panelPositions[panelSlotNumber]
            ? { display: "none" }
            : {
                top: `${panelPositions[panelSlotNumber].top}px`,
                width: `${panelPositions[panelSlotNumber].width}px`,
                height: `${panelPositions[panelSlotNumber].height}px`,
              }
        }
        onClick={
          players[slotNumber] && players[slotNumber].health > 0
            ? props.handleSpecPlayer
            : () => {}
        }
        id={"observer-" + slotNumber}
      ></div>
    );
  };
  return (
    <div ref={frameRef} className="player-control">
      {generateSlot(1)}
      {generateSlot(2)}
      {generateSlot(3)}
      {generateSlot(4)}
      {generateSlot(5)}
      {generateSlot(6, true)}
      {generateSlot(7, true)}
      {generateSlot(8, true)}
      {generateSlot(9, true)}
      {generateSlot(0, true)}
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
