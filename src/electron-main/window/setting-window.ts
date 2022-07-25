import { BrowserWindow } from 'electron';
import { getOrCreateSearchWindow } from './search-window';
import logger from '../../electron-shared/logger';
import { getWindowHashUrl } from '../../electron-shared/path-util';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-id';
import * as remoteMain from '@electron/remote/main';
import { Runtime } from '../../electron-shared/runtime';
import { notifyRendererWindowEvents } from '../utils/window-util';

export {
  getOrCreateSettingWindow,
};

function getOrCreateSettingWindow() {
  return windowContainer.find(WindowId.SETTING)
    ?? windowContainer.add(WindowId.SETTING, createWindow());
}

function close() {
  const window = windowContainer.find(WindowId.SETTING);
  if (window == null) return;
  window.close();
}

function destroy() {
  logger.log('destroy setting window');
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
  window.loadURL(getWindowHashUrl('setting'));

  window.once('ready-to-show', () => {
    window.show();
  });
  // currently in mac, modal window doesn't have close button
  // hence we listen blur event, and close window
  // https://github.com/electron/electron/issues/30232
  if (Runtime.isMac) {
    window.on('blur', async () => {
      close();
    });
  }
  window.on('closed', async () => {
    destroy();
  });

  // note that we notify parent window here!
  notifyRendererWindowEvents(WindowId.SETTING, window, parent)

  if (Runtime.isDev) {
    // window.webContents.openDevTools();
  }

  return window;
}
