import { BrowserWindow } from 'electron';
import { getOrCreateSearchWindow } from './search-window';
import logger from '../../electron-shared/logger';
import { getWindowHashUrl } from '../../electron-shared/path-util';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-id';
import * as remoteMain from '@electron/remote/main';
import { Runtime } from '../../electron-shared/runtime';
import path from 'path';

export {
  getOrCreateDeveloperWindow,
};

function getOrCreateDeveloperWindow() {
  return windowContainer.find(WindowId.DEVELOPER)
    ?? windowContainer.add(WindowId.DEVELOPER, createWindow());
}

function close() {
  const window = windowContainer.find(WindowId.DEVELOPER);
  if (window == null) return;
  window.close();
}

function destroy() {
  logger.log('destroy developer window');
  windowContainer.remove(WindowId.DEVELOPER);
}

function createWindow() {
  logger.log('create developer window');
  // create a modal window
  // https://electronjs.org/docs/api/browser-window#modal-windows
  const parent = getOrCreateSearchWindow();
  const window = new BrowserWindow({
    width: Runtime.isDev ? 1200 : 1200,
    height: 600,
    // width: 1020,
    // height: 752,
    modal: !Runtime.isMac,
    maximizable: false,
    minimizable: false,
    resizable: Runtime.isDev,

    // https://www.electronjs.org/docs/api/browser-window#showing-window-gracefully
    show: false, // not show until window is ready
    backgroundColor: '#2e2c29',

    parent,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      // preload: path.join(__dirname, "preload.js"),
      // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
      nodeIntegration: true,
      // see https://github.com/electron-userland/electron-forge/issues/2567
      contextIsolation: false,
      // to disable the cors policy, so that we can fetch resources from different origin
      webSecurity: false,
    },
  });
  remoteMain.enable(window.webContents);
  window.setMenuBarVisibility(false);

  // Load a remote URL
  // https://stackoverflow.com/a/47926513
  window.loadURL(getWindowHashUrl('developer'));

  window.once('ready-to-show', () => {
    window.show();
  });
  // // currently in mac, modal window doesn't have close button
  // // hence we listen blur event, and close window
  // // https://github.com/electron/electron/issues/30232
  // if (Runtime.isMac) {
  //   window.on('blur', async () => {
  //     close();
  //   });
  // }
  window.on('closed', async () => {
    destroy();
    logger.log(`${WindowId.DEVELOPER} closed`);
  });

  window.webContents.openDevTools();

  return window;
}
