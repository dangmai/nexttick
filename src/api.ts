import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5001",
});

export async function launchCsgo() {
  return await client.post("/launch");
}

export async function playDemo(demoPath: string) {
  return await client.post("/play/", {
    demoPath,
  });
}

export async function getPreferences() {
  return await client.get("/preferences/");
}

export async function setPreferences(width: number, height: number) {
  return await client.post("/preferences/", { width, height });
}

export async function specPlayer(steamId: string) {
  return await client.post("/spec-player/", {
    steamId,
  });
}

export async function showScoreboard() {
  return await client.post("/telnet-commands/", {
    command: "showScoreboard",
  });
}

export async function hideScoreboard() {
  return await client.post("/telnet-commands/", {
    command: "hideScoreboard",
  });
}

export async function openConsole() {
  return await client.post("/open-console/");
}

export async function goToPreviousRound() {
  return await client.post("/previous-round/");
}

export async function goToNextRound() {
  return await client.post("/next-round/");
}

export async function setVolume(volume: number) {
  return await client.post("/volume", { volume });
}

export async function setSpeed(speed: number) {
  return await client.post("/speed", { speed });
}

export async function toggleXray(showXray: boolean) {
  let command = "showXray";
  if (!showXray) {
    command = "hideXray";
  }
  return await client.post("/telnet-commands", {
    command,
  });
}

export async function togglePause() {
  return await client.post("/manual-commands", {
    command: "demo_togglepause",
    type: "bind",
  });
}

interface ManualCommand {
  type: "bind" | "telnet";
  command: string;
}
export async function sendManualCommand(command: ManualCommand) {
  return await client.post("/manual-commands/", command);
}
