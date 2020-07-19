import React, { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../rootReducer";
import { togglePlaying, PlayerState } from "../Overlay/Overlay";
import "./PlayerControl.css";
import * as api from "../../api";

interface PlayerControlProps {
  handleTogglePlayPause?: (e: MouseEvent) => void;
  handleSpecPlayer?: (e: MouseEvent) => void;
  players?: PlayerState[];
}
export const PlayerControl = (props: PlayerControlProps) => {
  const { players } = props;
  if (!players || players.length < 10) {
    return (
      <div
        className="player-control"
        onClick={props.handleTogglePlayPause}
      ></div>
    );
  }
  return (
    <div className="player-control" onClick={props.handleTogglePlayPause}>
      <div
        className="observer-slot"
        style={
          !players[1] || players[1].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-1"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[2] || players[2].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-2"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[3] || players[3].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-3"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[4] || players[4].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-4"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[5] || players[5].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-5"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[6] || players[6].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-6"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[7] || players[7].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-7"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[8] || players[8].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-8"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[9] || players[9].health === 0 ? { display: "none" } : {}
        }
        onClick={props.handleSpecPlayer}
        id="observer-9"
      ></div>
      <div
        className="observer-slot"
        style={
          !players[0] || players[0].health === 0 ? { display: "none" } : {}
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
