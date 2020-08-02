import { exec, spawn, ExecException } from "child_process";
import path from "path";

export function getDebugShortcut(): string {
  return "CommandOrControl+Shift+D";
}

export function getOverlayShortcut(): string {
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

export function manageWindows() {
  const setParent = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "build",
    "setParent.exe"
  );

  spawn(setParent, [], {
    stdio: "inherit",
    shell: true,
  });
}

export async function findCsgoPid(): Promise<number | null> {
  return new Promise((resolve, reject) => {
    exec("tasklist", {}, (err: ExecException | null, stdout: string) => {
      if (err) reject(err);

      const taskList = stdout.toLowerCase();
      let matches = taskList.match(/csgo\.exe\s+([0-9]*)\s/);
      if (matches && matches.length > 1) {
        resolve(parseInt(matches[1]));
      } else {
        resolve();
      }
    });
  });
}
