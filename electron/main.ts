import { app, BrowserWindow, Menu, ipcMain, IpcMainEvent } from 'electron';

import * as url from 'url';
import * as path from 'path';
import Database from './core/database';

let mainWindow: BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1180,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL((
        url.format({
            pathname: path.join(__dirname, '/../../dist/graph-inventory/index.html'),
            protocol: 'file:',
            slashes: true
        })
    ));

    //Menu.setApplicationMenu(null);
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // macOS
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('client:retriveDefaultFormValues', async (event: IpcMainEvent, ...args: any[]) => {
    let data = await Database.instance.retrieveDefaultFormValues().then((results: Object) => {
        return results;
    }).catch(err => console.error(err))
    event.sender.send('server:sendDefaultFormValues', data);
})