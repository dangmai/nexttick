import React, { MouseEvent, KeyboardEvent } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { GameState } from "csgo-gsi-types";

import "bootstrap/dist/css/bootstrap.css";
import "./Overlay.css";

type GameStateProps = {
  gameState?: GameState;
};
export function Overlay(props: GameStateProps) {
  const handleSpecPlayer = async (e: MouseEvent) => {
    e.preventDefault();
    const { gameState } = props;
    const observerSlot = e.currentTarget.getAttribute("id")?.split("-")[1];

    if (!gameState || !gameState.allplayers) {
      return <div></div>;
    }
    const allPlayers = gameState.allplayers;
    const players = Object.keys(allPlayers).map((steamId) => {
      return Object.assign({}, allPlayers[steamId], { steamId: steamId });
    });
    const chosenPlayer = players.filter(
      (player) => player.observer_slot?.toString() === observerSlot
    );
    if (chosenPlayer.length > 0) {
      const steamId = chosenPlayer[0].steamId;
      await axios.post("http://localhost:5001/spec-player/", {
        steamId,
      });
    }
  };
  const handleKeyDown = async (e: KeyboardEvent) => {
    e.preventDefault();
    console.log(e.repeat);
    if (e.keyCode === 9 && !e.repeat) {
      console.log("Tab held");
      await axios.post("http://localhost:5001/telnet-commands/", {
        command: "showScoreboard",
      });
    }
  };
  const handleKeyUp = async (e: KeyboardEvent) => {
    if (e.keyCode === 9) {
      console.log("Tab unheld");
      await axios.post("http://localhost:5001/telnet-commands/", {
        command: "hideScoreboard",
      });
    }
  };
  return (
    <div
      className="frame"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      <div className="overlay">
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-1"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-2"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-3"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-4"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-5"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-6"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-7"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-8"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-9"
        ></div>
        <div
          className="observer-slot"
          onClick={handleSpecPlayer}
          id="observer-0"
        ></div>
      </div>
      <Draggable
        axis="both"
        handle=".handle"
        defaultPosition={{ x: 0, y: 0 }}
        grid={[25, 25]}
        scale={1}
        bounds="parent"
      >
        <div className="controlPanel">
          <div className="handle">Drag from here</div>
          <div>This readme is really dragging on...</div>
        </div>
      </Draggable>
    </div>
  );
}
