// Modules to control application life and create native browser window

import checkFolder from './checkFolder';
import { shuffle } from './shuffle';
import { undo } from './undo';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const production = process.env.NODE_ENV !== 'dev';

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(production ? `File://${path.join(__dirname, '/index.html')}` : 'http://localhost:3143');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.handle('checkFolder', async (event: any, filePath: string): Promise<boolean> => {
    const result = await checkFolder(filePath);
    return result;
  });

  ipcMain.handle('shuffle', async (event:any, filePath: string): Promise<void> => {
    const result = await shuffle(filePath);
    return result;
  });

  ipcMain.handle('undo', async (event: any, filePath: string): Promise<void> => {
    const result = await undo(filePath);
    return result;
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
