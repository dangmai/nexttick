import { exec, spawn, ExecException } from "child_process";
import path from "path";

export function getDebugShortcut(): string {
  return "CommandOrControl+Shift+O";
}

export function activateWindow(
  windowName: string,
  keyToSend?: string,
  callback?: () => void
) {
  const activate = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "build",
    "activate.exe"
  );

  const params = [windowName];
  if (keyToSend) {
    params.push(keyToSend);
  }

  const process = spawn(activate, params, {
    stdio: "inherit",
    shell: true,
  });
  if (callback) {
    process.on("exit", callback);
  }
}

export async function isCsgoRunning(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    exec("tasklist", {}, (err: ExecException | null, stdout: string) => {
      if (err) reject(err);

      resolve(stdout.toLowerCase().indexOf("csgo.exe") > -1);
    });
  });
}
