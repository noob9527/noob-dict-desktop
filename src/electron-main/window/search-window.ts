import { BrowserWindow } from 'electron';
import logger from '../../common/utils/logger';
import isDev from 'electron-is-dev';
import { getOrCreateTray } from '../tray/tray';
import * as path from 'path';
import globalState from '../global-state';
import * as os from 'os';
import * as fs from 'fs';
import { getIconPath, getWindowHashUrl } from '../utils/path-util';
import { getOrCreateSettingWindow } from './setting-window';
import { ipcMain } from 'electron-better-ipc';
import { SearchChannel } from '../../common/ipc-channel';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-constants';

export {
  getOrCreateSearchWindow,
  toggleSearchWindow,
  showSearchWindow,
  hideSearchWindow,
  topSearchWindow,
};

function getOrCreateSearchWindow(): BrowserWindow {
  return windowContainer.find(WindowId.SEARCH)
    ?? windowContainer.add(WindowId.SEARCH, createWindow());
}

function destroy() {
  windowContainer.remove(WindowId.SEARCH);
}

function showSearchWindow(option: { isSettingWindowOpen: boolean } = { isSettingWindowOpen: false }) {
  logger.log('show search window');
  const window = getOrCreateSearchWindow();
  window.show();
  if (option.isSettingWindowOpen) getOrCreateSettingWindow().show();
  // if (window) {
  //   if (window.isMinimized()) window.restore();
  //   window.show();
  // } else {
  //   logger.error('somehow window doesn\'t exist');
  // }
}

function hideSearchWindow(option: { isSettingWindowOpen: boolean } = { isSettingWindowOpen: false }) {
  logger.log('hide search window');
  if (option.isSettingWindowOpen) getOrCreateSettingWindow().hide();
  const window = getOrCreateSearchWindow();
  window.hide();
}

function topSearchWindow(option: { isSettingWindowOpen: boolean } = { isSettingWindowOpen: false }) {
  const window = getOrCreateSearchWindow();
  window.moveTop();
}

function toggleSearchWindow(option: { isSettingWindowOpen: boolean } = { isSettingWindowOpen: false }) {
  logger.log('toggleSearchWindow', new Date());
  const searchWindow = getOrCreateSearchWindow();
  if (searchWindow.isMinimized() || !searchWindow.isVisible()) {
    showSearchWindow(option);
    return true;
  } else {
    hideSearchWindow(option);
    return false;
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: isDev ? 1600 : 1200,
    height: 900,
    icon: getIconPath('icon.png'),
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
      nodeIntegration: true,
      // to disable the cors policy, so that we can fetch resources from different origin
      webSecurity: false,
    },

    // https://www.electronjs.org/docs/api/browser-window#showing-window-gracefully
    show: false, // not show until window is ready
    backgroundColor: '#2e2c29',

    // doesn't work on linux
    // https://electronjs.org/docs/api/browser-window
    minimizable: false,
    maximizable: false,
  });

  // remove menu bar
  // https://stackoverflow.com/questions/39091964/remove-menubar-from-electron-app
  // window.setMenuBarVisibility(false); // turns out this is the only work way to hide the menu bar
  // window.setMenu(null);
  // window.removeMenu();
  // Menu.setApplicationMenu(null);
  // window.setAutoHideMenuBar(true);

  window.loadURL(getWindowHashUrl());

  window.once('ready-to-show', () => {
    if(!process.argv.includes('--background')) {
      window.show();
    }
  });
  window.on('close', e => {
    // close to tray
    // https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
    if (!globalState.isQuiting) {
      e.preventDefault();
      window.hide();
    }
  });

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    destroy();
    logger.log('closed');
  });

  window.on('show', e => {
    logger.log('search window show');
    ipcMain.callRenderer(window, SearchChannel.SEARCH_WINDOW_SHOWED, e);
  });
  window.on('hide', e => {
    logger.log('search window hide');
    ipcMain.callRenderer(window, SearchChannel.SEARCH_WINDOW_HIDED, e);
  });
  window.on('restore', e => {
    logger.log('search window restore');
    ipcMain.callRenderer(window, SearchChannel.SEARCH_WINDOW_RESTORED, e);
  });
  window.on('minimize', e => {
    logger.log('search window minimize');
    ipcMain.callRenderer(window, SearchChannel.SEARCH_WINDOW_MINIMIZED, e);
  });
  window.on('focus', e => {
    logger.log('search window focus');
    ipcMain.callRenderer(window, SearchChannel.SEARCH_WINDOW_FOCUS, e);
  });
  window.on('blur', e => {
    logger.log('search window blur');
    ipcMain.callRenderer(window, SearchChannel.SEARCH_WINDOW_BLUR, e);
  });

  window.webContents.on('did-finish-load', () => {
    getOrCreateTray();
    logger.log('did-finish-load');
  });
  // stop link from opening new window
  // https://stackoverflow.com/questions/46462248/electron-link-opens-in-new-window
  window.webContents.on('new-window', (event) => {
    event.preventDefault();
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
