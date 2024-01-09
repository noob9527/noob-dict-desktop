import { app, BrowserWindow, session } from 'electron';
import logger from '../../electron-shared/logger';
import { getOrCreateTray } from '../tray/tray';
import * as path from 'path';
import globalState from '../global-state';
import * as os from 'os';
import * as fs from 'fs';
import { getIconPath, getWindowHashUrl } from '../../electron-shared/path-util';
import { ipcMain } from 'electron-better-ipc';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-id';
import * as remoteMain from '@electron/remote/main';
import { Runtime } from '../../electron-shared/runtime';
import { notifyRendererWindowEvents } from '../utils/window-util';
import { AppChannel } from '../../electron-shared/ipc/ipc-channel-app';

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

function showSearchWindow() {
  logger.log('show search window');
  const window = getOrCreateSearchWindow();
  window.show();
  // if (window) {
  //   if (window.isMinimized()) window.restore();
  //   window.show();
  // } else {
  //   logger.error('somehow window doesn\'t exist');
  // }
}

function hideSearchWindow() {
  logger.log('hide search window');
  const window = getOrCreateSearchWindow();
  window.hide();
}

function topSearchWindow() {
  const window = getOrCreateSearchWindow();
  window.moveTop();
}

function toggleSearchWindow() {
  logger.log('toggleSearchWindow', new Date());
  const searchWindow = getOrCreateSearchWindow();
  if (searchWindow.isMinimized() || !searchWindow.isVisible()) {
    showSearchWindow();
    return true;
  } else {
    hideSearchWindow();
    return false;
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: Runtime.isDev ? 1600:1200,
    height: 900,
    icon: getIconPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      // preload: path.join(__dirname, "preload.js"),
      // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
      nodeIntegration: true,
      // // see https://github.com/electron-userland/electron-forge/issues/2567
      contextIsolation: false,
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
  remoteMain.enable(window.webContents);

  // remove menu bar
  // https://stackoverflow.com/questions/39091964/remove-menubar-from-electron-app
  // window.setMenuBarVisibility(false); // turns out this is the only work way to hide the menu bar
  // window.setMenu(null);
  // window.removeMenu();
  // Menu.setApplicationMenu(null);
  // window.setAutoHideMenuBar(true);

  window.loadURL(getWindowHashUrl('main/search'));

  window.once('ready-to-show', () => {
    if (!process.argv.includes('--background')) {
      window.show();
    }
  });

  // let allowAppQuit = false;
  // todo: vite
  let allowAppQuit = true;

  window.on('close', async e => {
    // close to tray
    // https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
    if (!globalState.isQuiting) {
      e.preventDefault();
      window.hide();
    } else {
      if (!allowAppQuit) {
        e.preventDefault();
        logger.log('app is quiting');
        allowAppQuit = await ipcMain.callRenderer(window, AppChannel.APP_QUITING) as boolean;
        if (allowAppQuit) {
          logger.log('app is ready to quit');
          app.quit();
        }
      }
    }
  });

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    destroy();
    logger.log('search window closed');
  });

  notifyRendererWindowEvents(WindowId.SEARCH, window);

  window.webContents.on('did-finish-load', () => {
    getOrCreateTray();
    logger.log('did-finish-load');
  });
  // stop link from opening new window
  // https://stackoverflow.com/questions/46462248/electron-link-opens-in-new-window
  // window.webContents.on('new-window', (event) => {
  //   event.preventDefault();
  // });
  // https://www.electronjs.org/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler
  window.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  if (Runtime.isDev) {
    // Open the DevTools.
    window.webContents.openDevTools();
    // todo: vite
    // add devtools
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    // let extensionRelativeFolder: string;
    // if (Runtime.isMac) {
    //   extensionRelativeFolder = 'Library/Application Support/Google/Chrome/Default/Extensions';
    // } else {
    //   extensionRelativeFolder = '.config/google-chrome/Default/Extensions';
    // }
    // const extensionDir = path.join(os.homedir(), extensionRelativeFolder);
    // const reactDir = path.join(extensionDir, 'fmkadmapgofadopljbjfkapdkoienihi');
    // const reduxDir = path.join(extensionDir, 'lmhkpmbekcpmknklioeibfkpmmfibljd');
    // if (fs.existsSync(reactDir)) {
    //   const react = fs.readdirSync(reactDir);
    //   if (react.length) {
    //     const reactExt = path.join(reactDir, react[react.length - 1]);
    //     console.log(`load react dev tools from: ${reactExt}`);
    //     session.defaultSession.loadExtension(reactExt);
    //   }
    // }
    // if (fs.existsSync(reduxDir)) {
    //   const redux = fs.readdirSync(reduxDir);
    //   if (redux.length) {
    //     const reduxExt = path.join(reduxDir, redux[redux.length - 1]);
    //     console.log(`load redux dev tools from: ${reduxExt}`);
    //     session.defaultSession.loadExtension(reduxExt);
    //   }
    // }
  }

  return window;
}
