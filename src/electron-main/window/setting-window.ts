import { BrowserWindow } from 'electron';
import { getOrCreateSearchWindow } from './search-window';
import logger from '../../electron-shared/logger';
import { ipcMain } from 'electron-better-ipc';
import { SearchChannel, SettingChannel } from '../../common/ipc-channel';
import { getWindowHashUrl } from '../../electron-shared/path-util';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-constants';
import * as remoteMain from '@electron/remote/main';
import { Runtime } from '../../electron-shared/runtime';

export {
  getOrCreateSettingWindow,
};

function getOrCreateSettingWindow() {
  return windowContainer.find(WindowId.SETTING)
    ?? windowContainer.add(WindowId.SETTING, createWindow());
}

function destroy() {
  windowContainer.remove(WindowId.SETTING);
}

function createWindow() {
  // create a modal window
  // https://electronjs.org/docs/api/browser-window#modal-windows
  const parent = getOrCreateSearchWindow();
  const window = new BrowserWindow({
    width: Runtime.isDev ? 400 : 400,
    height: 200,
    maximizable: false,
    minimizable: false,
    // currently in mac, modal window cannot be closed
    // https://github.com/electron/electron/issues/30232
    modal: !Runtime.isMac,
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
  window.loadURL(getWindowHashUrl('setting'));

  window.once('ready-to-show', () => {
    window.show();
  });
  window.on('show', e => {
    logger.log('setting window show');
    ipcMain.callRenderer(parent, SettingChannel.SETTING_WINDOW_OPENED);
  });
  window.on('closed', async () => {
    ipcMain.callRenderer(parent, SettingChannel.SETTING_WINDOW_CLOSED);
    destroy();
    logger.log(`${WindowId.SETTING} closed`);
  });

  if (Runtime.isDev) {
    // window.webContents.openDevTools();
  }

  return window;
}
