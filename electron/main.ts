import { app, BrowserWindow, Menu, ipcMain, IpcMainEvent } from "electron";

import * as url from "url";
import * as path from "path";
import Database from "./core/database";
import Store from "./core/store";

const db: Database = new Database();
const store: Store = new Store({
  configName: 'user-preferences',
  defaults: {}
});

let win: BrowserWindow;

// SET ENV
process.env.NODE_ENV = "development";

// Vérifie si les informations de connexion à la base de données ont déjà été assignées
if (store.has('databaseCredentials')) {
  db.init(store.get('databaseCredentials'));
}

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

ipcMain.handle('client:requestDatabaseStatus', (event: IpcMainEvent, ...args: any[]) => {
  return store.has('databaseCredentials');
})

ipcMain.handle('client:sendDatabaseCredentials', (event: IpcMainEvent, ...args: any[]) => {
  store.set('databaseCredentials', args[0]);
  return db.init(store.get('databaseCredentials'));
})

ipcMain.handle('client:requestFormValues', async (event: IpcMainEvent, ...args: any[]) => {
  return await db
    .retrieveDefaultFormValues()
    .then(results => results)
    .catch(console.error)
})

ipcMain.handle('client:requestResults', async (event: IpcMainEvent, ...args: any[]) => {
  return await db
    .getResults(args[0])
    .then(results => results)
    .catch(console.error);
})