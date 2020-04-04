import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { getOrCreateSearchWindow } from './search-window';
import logger from '../../common/utils/logger';
import { ipcMain } from 'electron-better-ipc';
import { SearchChannel, SettingChannel } from '../../common/ipc-channel';
import { getWindowHashUrl } from '../utils/path-util';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-constants';

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
    width: isDev ? 400 : 400,
    height: 200,
    modal: true,
    resizable: false,

    // https://www.electronjs.org/docs/api/browser-window#showing-window-gracefully
    show: false, // not show until window is ready
    backgroundColor: '#2e2c29',

    parent,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
      nodeIntegration: true,
      // to disable the cors policy, so that we can fetch resources from different origin
      webSecurity: false,
    },
  });
  window.setMenuBarVisibility(false);

  // Load a remote URL
  // https://stackoverflow.com/a/47926513
  window.loadURL(getWindowHashUrl('setting'));

  window.once('ready-to-show', () => {
    window.show();
  });
  window.on('show', e => {
    logger.log('setting window show');
    ipcMain.callRenderer(parent, SettingChannel.SETTING_WINDOW_OPENED, e);
  });
  window.on('closed', async () => {
    ipcMain.callRenderer(parent, SettingChannel.SETTING_WINDOW_CLOSED);
    destroy();
    logger.log(`${WindowId.SETTING} closed`);
  });

  if (isDev) {
    // window.webContents.openDevTools();
  }

  return window;
}