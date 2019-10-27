import { BrowserWindow } from 'electron';
import logger from '../shared/utils/logger';
import holder from '../shared/utils/instance-holder';
import isDev from 'electron-is-dev';
import { ensureTray } from './tray/tray';
import * as path from 'path';
import getAssetsPath from "../shared/utils/path-util";
import globalState from './global-state';
import * as os from "os";
import * as fs from "fs";

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
    width: isDev ? 1600 : 800,
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
    window.webContents.openDevTools();
    // add devtools
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    const extensionDir = path.join(os.homedir(), '.config/google-chrome/Default/Extensions');
    const reactDir = path.join(extensionDir, 'fmkadmapgofadopljbjfkapdkoienihi');
    const reduxDir = path.join(extensionDir, 'lmhkpmbekcpmknklioeibfkpmmfibljd');
    if (fs.existsSync(reactDir)) {
      const react = fs.readdirSync(reactDir);
      if (react.length) {
        const reactExt = path.join(reactDir, react[react.length - 1]);
        console.log(`load react dev tools from: ${reactExt}`);
        BrowserWindow.addDevToolsExtension(reactExt);
      }
    }
    if (fs.existsSync(reduxDir)) {
      const redux = fs.readdirSync(reduxDir);
      if (redux.length) {
        const reduxExt = path.join(reduxDir, redux[redux.length - 1]);
        console.log(`load redux dev tools from: ${reduxExt}`);
        BrowserWindow.addDevToolsExtension(reduxExt);
      }
    }
  }

  return window;
}
