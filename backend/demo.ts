import { promises as fsPromises } from "fs";

import { DemoFile } from "demofile";

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
export const parseDemo = async (demoPath: string): Promise<DemoResult> => {
  return new Promise(async (resolve) => {
    const result: DemoResult = {
      rounds: [],
      players: [],
    };
    const content = await fsPromises.readFile(demoPath);
    const demo = new DemoFile();

    demo.gameEvents.on("round_start", (e) => {
      if (!demo.gameRules.isWarmup) {
        result.rounds.push({
          roundNumber: demo.gameRules.roundNumber,
          time: demo.currentTime,
          tick: demo.currentTick,
        });
      }
    });

    demo.on("end", (e) => {
      console.log("Done");
      resolve(result);
    });

    demo.stringTables.on("update", (e) => {
      if (
        e.table.name === "userinfo" &&
        e.userData != null &&
        e.userData.xuid > 0
      ) {
        const steamId = e.userData.xuid.toString();

        if (result.players.filter((p) => p.steamId === steamId).length === 0) {
          result.players.push({ steamId });
        }
      }
    });
    demo.parse(content);
  });
};
