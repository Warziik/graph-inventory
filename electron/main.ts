import { app, BrowserWindow, Menu, ipcMain, IpcMainEvent, nativeTheme } from "electron";

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
process.env.NODE_ENV = "devlopment";

// Vérifie si les informations de connexion à la base de données ont déjà été assignées
if (store.has('databaseCredentials')) {
  db.init(store.get('databaseCredentials'));
}

// Vérifie si l'utilisateur a déjà choisi un thème
if (!store.has('useDarkTheme')) {
  store.set('useDarkTheme', nativeTheme.shouldUseDarkColors);
}

// Évènement appelé lorsque le thème du système d'exploitation change
nativeTheme.on('updated', () => {
  console.log(`NATIVE THEME UPDATED - useDarkTheme: ${nativeTheme.shouldUseDarkColors}`);
  store.set('useDarkTheme', nativeTheme.shouldUseDarkColors);
})

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

ipcMain.handle('client:requestUserPreferences', (event: IpcMainEvent, ...args: any[]) => {
  const databaseConnected: boolean = store.has('databaseCredentials');
  const useDarkTheme: boolean = store.get('useDarkTheme');
  return { databaseConnected, useDarkTheme };
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

ipcMain.on('client:updateTheme', (event: IpcMainEvent, ...args: any[]) => {
  store.set('useDarkTheme', args[0]);
})