import { promises as fsPromises } from "fs";
import path from "path";
import { spawn } from "child_process";
import os from "os";

import Conf from "conf";

import { sendCommands } from "./telnet";
import { getPlatformInstance } from "./platform/platform";

const STEAM_PATH = ["C:\\", "Program Files (x86)", "Steam"];

const CSGO_PATH = [
  ...STEAM_PATH,
  "steamapps",
  "common",
  "Counter-Strike Global Offensive",
];
const platformInstance = getPlatformInstance();

export async function applyAutoexec() {
  await fsPromises.copyFile(
    path.join(__dirname, "..", "..", "resources/nextTickAutoExec.cfg"),
    path.resolve(...CSGO_PATH, "csgo", "cfg", "nextTickAutoExec.cfg")
  );
  await fsPromises.copyFile(
    path.join(
      __dirname,
      "..",
      "..",
      "resources/gamestate_integration_nexttick.cfg"
    ),
    path.resolve(
      ...CSGO_PATH,
      "csgo",
      "cfg",
      "gamestate_integration_nexttick.cfg"
    )
  );
}

export async function applyCommandsViaBind(commands: string | string[]) {
  console.log(`Executing commands via bind: ${commands}`);
  const configPath = path.resolve(...CSGO_PATH, "csgo", "cfg", "nextTick.cfg");
  let fileContent;
  if (typeof commands === "string") {
    fileContent = commands;
  } else {
    fileContent = commands.join(os.EOL);
  }
  await fsPromises.writeFile(configPath, fileContent, { encoding: "utf8" });
  return new Promise((resolve) => {
    platformInstance.activateWindow(
      '"Counter-Strike: Global Offensive"',
      '"{f8}"',
      () => {
        platformInstance.activateWindow(
          '"NextTick - Overlay"',
          undefined,
          () => {
            resolve();
          }
        );
      }
    );
  });
}

export async function applyCommandsViaTelnet(
  commands: string | string[]
): Promise<string | undefined> {
  console.log(`Executing commands via telnet: ${commands}`);
  return await sendCommands(commands);
}

export async function launchCsgo(config: Conf, extraArgs?: string[]) {
  const steamPath = path.resolve(...STEAM_PATH);
  let width = config.get("width") as number;
  let height = config.get("height") as number;
  let options = [
    "-applaunch",
    "730",
    "-insecure",
    "-netconport",
    "23243",
    "-novid",
    "-x",
    "0",
    "-y",
    "0",
    "+exec",
    "nextTickAutoExec",
    "-width",
    width.toString(),
    "-height",
    height.toString(),
    "-windowed",
    "-noborder",
  ];
  if (extraArgs !== undefined) {
    options = [...options, ...extraArgs];
  }
  const csgoProcess = spawn("steam.exe", options, {
    cwd: steamPath,
    detached: true,
    stdio: "ignore",
  });
  csgoProcess.unref();
}
export async function playDemo(config: Conf, demoPath: string) {
  await launchCsgo(config, ["+playDemo", demoPath]);
}
