import { promises as fsPromises } from "fs";
import path from "path";
import { spawn } from "child_process";
import os from "os";

import Conf from "conf";
import { Hardware } from "keysender";

import { sendCommands } from "./telnet";

const STEAM_PATH = ["C:\\", "Program Files (x86)", "Steam"];

const CSGO_PATH = [
  ...STEAM_PATH,
  "steamapps",
  "common",
  "Counter-Strike Global Offensive",
];

export async function applyAutoexec() {
  await fsPromises.copyFile(
    path.join(__dirname, "..", "..", "resources/betterDemoAutoExec.cfg"),
    path.resolve(...CSGO_PATH, "csgo", "cfg", "betterDemoAutoExec.cfg")
  );
  await fsPromises.copyFile(
    path.join(
      __dirname,
      "..",
      "..",
      "resources/gamestate_integration_betterdemoui.cfg"
    ),
    path.resolve(
      ...CSGO_PATH,
      "csgo",
      "cfg",
      "gamestate_integration_betterdemoui.cfg"
    )
  );
}

export async function applyCommandsViaBind(commands: string | string[]) {
  const configPath = path.resolve(
    ...CSGO_PATH,
    "csgo",
    "cfg",
    "betterDemoUI.cfg"
  );
  let fileContent;
  if (typeof commands === "string") {
    fileContent = commands;
  } else {
    fileContent = commands.join(os.EOL);
  }
  await fsPromises.writeFile(configPath, fileContent, { encoding: "utf8" });
  await runBind();
}

export async function applyCommandsViaTelnet(commands: string | string[]) {
  await sendCommands(commands);
}

async function runBind() {
  let obj = new Hardware("Counter-Strike: Global Offensive");
  obj.workwindow.setForeground();
  obj.keyboard.sendKey("f8");
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
    "-width",
    width.toString(),
    "-height",
    height.toString(),
    "-windowed",
    "-noborder",
    "+exec",
    "betterDemoAutoExec",
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
