import os from "os";
import * as Win32 from "./win32";

export interface PlatformCommands {
  getDebugShortcut(): string;
  activateWindow(
    windowName: string,
    keyToSend?: string,
    callback?: () => void
  ): void;
}

export function getPlatformInstance(): PlatformCommands {
  switch (os.platform()) {
    case "win32":
      return Win32;
    default:
      return Win32;
  }
}
