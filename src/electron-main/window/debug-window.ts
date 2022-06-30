import { BrowserWindow } from 'electron';
import { getOrCreateSearchWindow } from './search-window';
import logger from '../../electron-shared/logger';
import { ipcMain } from 'electron-better-ipc';
import { getWindowHashUrl } from '../../electron-shared/path-util';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-constants';
import * as remoteMain from '@electron/remote/main';
import { Runtime } from '../../electron-shared/runtime';

export {
  getOrCreateDeveloperWindow,
};

function getOrCreateDeveloperWindow() {
  return windowContainer.find(WindowId.DEVELOPER)
    ?? windowContainer.add(WindowId.DEVELOPER, createWindow());
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
    modal: true,
    resizable: Runtime.isDev,

    // https://www.electronjs.org/docs/api/browser-window#showing-window-gracefully
    show: false, // not show until window is ready
    backgroundColor: '#2e2c29',

    parent,
    webPreferences: {
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
  window.on('show', e => {
    logger.log('developer window show');
    // ipcMain.callRenderer(parent, DeveloperChannel.DEVELOPER_WINDOW_OPENED, e);
  });
  window.on('closed', async () => {
    // ipcMain.callRenderer(parent, DeveloperChannel.DEVELOPER_WINDOW_CLOSED);
    destroy();
    logger.log(`${WindowId.DEVELOPER} closed`);
  });

  window.webContents.openDevTools();

  return window;
}
