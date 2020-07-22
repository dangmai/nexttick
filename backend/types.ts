interface Round {
  roundNumber: number;
  time: number;
  tick: number;
}
interface Player {
  steamId: string;
}
export interface DemoResult {
  players: Player[];
  rounds: Round[];
}
