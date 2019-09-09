import { app, BrowserWindow, Menu } from 'electron';

import * as url from 'url';
import * as path from 'path';

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