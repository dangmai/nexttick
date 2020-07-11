import React, { MouseEvent } from "react";
import axios from "axios";

import { GameState } from "csgo-gsi-types";

type GameStateProps = {
  gameState?: GameState;
};
export function GameStateCmp(props: GameStateProps) {
  const { gameState } = props;

  const handleSpecPlayer = async (e: MouseEvent) => {
    e.preventDefault();
    const steamId = e.currentTarget.getAttribute("name");
    const result = await axios.post("http://localhost:5001/spec-player/", {
      steamId,
    });
    console.log(result);
  };
  if (!gameState || !gameState.allplayers) {
    return <div></div>;
  }

  const allPlayers = gameState.allplayers;
  const players = Object.keys(allPlayers).map((steamId) => {
    return Object.assign({}, allPlayers[steamId], { steamId: steamId });
  });
  return (
    <div>
      <h1>Currently watching: {gameState.player?.name}</h1>
      <h1>T Side: {gameState.map?.team_t.score}</h1>
      {players
        .filter((player) => player.team === "T")
        .map((player) => (
          <div key={player.steamId}>
            {player.state.health > 0 ? (
              <button
                className="btn btn-link"
                onClick={handleSpecPlayer}
                name={player.steamId}
              >
                {player.name}
              </button>
            ) : (
              <span>{player.name}</span>
            )}
            <br />
            Health: {player.state.health}
          </div>
        ))}
      <h1>CT Side: {gameState.map?.team_ct.score}</h1>
      {players
        .filter((player) => player.team === "CT")
        .map((player) => (
          <div key={player.steamId}>
            {player.state.health > 0 ? (
              <button
                className="btn btn-link"
                onClick={handleSpecPlayer}
                name={player.steamId}
              >
                {player.name}
              </button>
            ) : (
              <span>{player.name}</span>
            )}
            <br />
            Health: {player.state.health}
          </div>
        ))}
    </div>
  );
}
