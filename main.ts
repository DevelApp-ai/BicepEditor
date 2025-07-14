import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import { GitModuleAnalyzer } from './git-module-analyzer';
import { FeatureFlagManager } from './feature-flag-manager';
import { BicepFileManager } from './bicep-file-manager';

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;

// Application data path
const appDataPath = path.join(app.getPath('userData'), 'BicepBlocklyEditor');

// Create app data directory if it doesn't exist
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

// Create cache directory for git repositories
const cachePath = path.join(appDataPath, 'cache');
if (!fs.existsSync(cachePath)) {
  fs.mkdirSync(cachePath, { recursive: true });
}

// Initialize managers
const gitModuleAnalyzer = new GitModuleAnalyzer(cachePath);
const featureFlagManager = new FeatureFlagManager(appDataPath);
const bicepFileManager = new BicepFileManager(appDataPath);

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html file
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron has finished initialization
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS applications keep their menu bar active until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS re-create a window when the dock icon is clicked and no other windows are open
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for application info
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

// IPC handlers for application paths
ipcMain.handle('app-get-paths', () => {
  return {
    appData: appDataPath,
    cache: cachePath
  };
});
