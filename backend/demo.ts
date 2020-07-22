import { promises as fsPromises } from "fs";

import { DemoFile } from "demofile";
import { DemoResult } from "./types";

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

parseDemo(process.argv[2])
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
