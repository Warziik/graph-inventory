import { app, BrowserWindow, Menu, ipcMain, IpcMainEvent } from "electron";

import * as url from "url";
import * as path from "path";
import Database from "./core/database";

let win: BrowserWindow;

// SET ENV
process.env.NODE_ENV = "development";

function createWindow() {
  win = new BrowserWindow({
    width: 1180,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "/../../dist/graph-inventory/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  win.webContents.openDevTools();

  if (process.env.NODE_ENV === "production") {
    Menu.setApplicationMenu(null);
    win.webContents.closeDevTools();
  }

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  // macOS
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on(
  "client:retriveDefaultFormValues",
  async (event: IpcMainEvent, ...args: any[]) => {
    let data = await Database.instance
      .retrieveDefaultFormValues()
      .then(results => results)
      .catch(console.error);
    event.sender.send("server:sendDefaultFormValues", data);
  }
);

ipcMain.on(
  "client:sendSearchValues",
  async (event: IpcMainEvent, ...args: any[]) => {
    let data = await Database.instance
      .getResults(args[0])
      .then(results => results)
      .catch(console.error);
    event.sender.send("server:sendResults", data);
  }
);
