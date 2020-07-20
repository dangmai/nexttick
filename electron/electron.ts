import { app, BrowserWindow, ipcMain, dialog, globalShortcut } from "electron";
import Conf from "conf";
import isDev from "electron-is-dev";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
import { getPlatformInstance } from "../backend/platform/platform";
import { GameStateChangeMessage } from "../backend/message";
if (!isDev) {
  require("../backend/server");
}

let win: BrowserWindow | null = null;
let overlayWin: BrowserWindow | null = null;
let debugWin: BrowserWindow | null = null;

const config = new Conf();
const platformInstance = getPlatformInstance();

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 650,
    icon: isDev
      ? `${__dirname}/../../public/favicon.ico`
      : `${__dirname}/../favicon.ico`,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000/index.html/#/");
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on("closed", () => (win = null));

  console.log("Window loaded");
}

function createOverlay() {
  console.log("Creating overlay");
  if (!overlayWin) {
    overlayWin = new BrowserWindow({
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    overlayWin.setBounds({
      width: config.get("width") as number,
      height: config.get("height") as number,
      x: 0,
      y: 0,
    });

    if (isDev) {
      overlayWin.loadURL("http://localhost:3000/index.html/#/overlay");
    } else {
      // 'build/index.html'
      overlayWin.loadURL(`file://${__dirname}/../index.html/#/overlay`);
    }
    overlayWin.on("closed", () => (overlayWin = null));
  } else if (!overlayWin.isVisible()) {
    overlayWin.show();
  }
}

function toggleDebugWindow() {
  if (!debugWin) {
    debugWin = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    if (isDev) {
      debugWin.loadURL("http://localhost:3000/index.html/#/debug");
    } else {
      // 'build/index.html'
      debugWin.loadURL(`file://${__dirname}/../index.html/#/debug`);
    }
    debugWin.on("closed", () => (debugWin = null));
  } else {
    debugWin.close();
  }
}
const toggleGameControl = () => {
  if (overlayWin && overlayWin.isFocused()) {
    platformInstance.activateWindow('"Counter-Strike: Global Offensive"');
  } else {
    platformInstance.activateWindow(
      '"Counter-Strike: Global Offensive"',
      undefined,
      () => {
        overlayWin?.focus();
      }
    );
  }
};

app.on("ready", () => {
  if (isDev) {
    console.log("Loading extensions");
    // DevTools
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(() => {
        console.log(`Added React Developer Tool`);
      })
      .catch((err) =>
        console.log(
          "An error occured while installing React Developer Tool:",
          err
        )
      )
      .then(() => {
        return installExtension(REDUX_DEVTOOLS);
      })
      .then(() => {
        console.log("Added Redux Developer Tool");
      })
      .catch((err) =>
        console.log("An error while installing Redux Developer Tool:", err)
      );
  }
  createWindow();

  globalShortcut.register(platformInstance.getDebugShortcut(), () => {
    toggleDebugWindow();
  });
  globalShortcut.register("shift+f3", async () => {
    toggleGameControl();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

app.commandLine.appendSwitch("high-dpi-support", "1");
app.commandLine.appendSwitch("force-device-scale-factor", "1");

ipcMain.on("openOverlay", (event, arg) => {
  console.log("Opening overlay");
  createOverlay();
});

ipcMain.on("quit", () => {
  app.quit();
});

ipcMain.on("closeOverlay", (event, arg) => {
  console.log("Closing overlay");
  overlayWin?.close();
});

ipcMain.on("stateChanged", async (event, arg: GameStateChangeMessage) => {
  console.log("App State Changed");
  console.log(arg);
  if (arg.gameInDemoMode && arg.demoPlaying) {
    createOverlay();
  } else if (!arg.gameInDemoMode) {
    overlayWin?.close();
  }
});

ipcMain.on("chooseDemo", async (event) => {
  const demoPath = dialog.showOpenDialogSync({
    properties: ["openFile"],
    filters: [{ name: "Demo Files", extensions: ["dem"] }],
  });
  if (demoPath && demoPath.length > 0) {
    event.reply("demoPath", demoPath[0]);
  }
});

ipcMain.on("toggleGameControl", async () => {
  toggleGameControl();
});

ipcMain.on("showMainWindow", async () => {
  win?.focus();
});
