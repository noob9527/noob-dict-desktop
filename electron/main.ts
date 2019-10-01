// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import logger from '../src/shared/utils/logger';
import holder from '../src/shared/utils/instance-holder';
import isDev from 'electron-is-dev';
import ensureTray from './tray/tray';
import * as path from 'path';
import getAssetsPath from "../src/shared/utils/path-util";

let is_quiting = false;

// Make this app a single instance app.
if (!app.requestSingleInstanceLock()) {
  app.quit();
}
app.on("second-instance", () => {
  logger.log("second-instance");
  const window = holder.get(BrowserWindow);
  if (window) {
    if (window.isMinimized()) {
      window.restore()
    }
    window.show();
  } else {
    logger.error("somehow window doesn't exist")
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", ensureWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
  //   app.quit();
  // }

  // we do not quit the app here
  logger.log('window-all-closed');
});

// On OS X it"s common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on("activate", ensureWindow);

app.on("before-quit", () => {
  is_quiting = true;
});

function ensureWindow() {
  holder.setIfAbsent(BrowserWindow, createWindow);
  return holder.get(BrowserWindow);
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1600,
    height: 600,
    icon: getAssetsPath('iconTemplate.png'),
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
      nodeIntegration: true
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
    if (!is_quiting) {
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


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// hot reload
try {
  require('electron-reloader')(module);
} catch (_) {
}
