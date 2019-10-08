import { BrowserWindow } from 'electron';
import logger from '../src/shared/utils/logger';
import holder from '../src/shared/utils/instance-holder';
import isDev from 'electron-is-dev';
import { ensureTray } from './tray/tray';
import * as path from 'path';
import getAssetsPath from "../src/shared/utils/path-util";
import globalState from './global-state';

export function ensureWindow() {
  holder.setIfAbsent(BrowserWindow, createWindow);
  return holder.get(BrowserWindow);
}

export function showWindow() {
  const window = holder.get(BrowserWindow);
  if (window) {
    if (window.isMinimized()) window.restore();
    window.show();
  } else {
    logger.error("somehow window doesn't exist");
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1600,
    height: 600,
    icon: getAssetsPath('iconTemplate.png'),
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
      nodeIntegration: true,
      // to disable the cors policy, so that we can fetch resources from different origin
      webSecurity: false,
    },
  });

  window.loadURL(isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // window.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  // and load the index.html of the app.
  // window.loadFile('index.html')

  window.on("close", e => {
    // close to tray
    // https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
    if (!globalState.isQuiting) {
      e.preventDefault();
      window.hide();
    }
  });

  // Emitted when the window is closed.
  window.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    holder.remove(BrowserWindow);
    logger.log('closed');
  });

  window.webContents.on("did-finish-load", () => {
    ensureTray();
    logger.log('did-finish-load');
  });

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    window.webContents.openDevTools();
  }

  return window;
}
