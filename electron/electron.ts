import { app, BrowserWindow, ipcMain, dialog } from "electron";
import Conf from "conf";
import isDev from "electron-is-dev";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

if (!isDev) {
  require("../backend/server");
}

let win: BrowserWindow | null = null;
let overlayWin: BrowserWindow | null = null;
const config = new Conf();

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

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  console.log("Window loaded");
}

function createOverlay() {
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
    overlayWin.loadURL("http://localhost:3000/index.html/#/state");
  } else {
    // 'build/index.html'
    overlayWin.loadURL(`file://${__dirname}/../index.html/#/state`);
  }
  overlayWin.on("closed", () => (overlayWin = null));
}

app.on("ready", createWindow);

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

ipcMain.on("closeOverlay", (event, arg) => {
  console.log("Closing overlay");
  overlayWin?.close();
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
