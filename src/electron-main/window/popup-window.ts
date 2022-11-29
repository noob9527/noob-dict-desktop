import { BrowserWindow, screen } from 'electron';
import * as path from 'path';
import { mainContainer } from '../../common/container/main-container';
import logger from '../../electron-shared/logger';
import { ipcMain } from 'electron-better-ipc';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-id';
import * as remoteMain from '@electron/remote/main';
import { Runtime } from '../../electron-shared/runtime';
import { SearchChannel } from '../../electron-shared/ipc/ipc-channel-search';

export {
  getOrCreatePopupWindow,
  showPopupWindow,
  hidePopupWindow,
};

function getOrCreatePopupWindow() {
  return windowContainer.find(WindowId.POPUP)
    ?? windowContainer.add(WindowId.POPUP, createWindow());
}

function destroy() {
  windowContainer.remove(WindowId.POPUP);
}

function showPopupWindow() {
  const window = getOrCreatePopupWindow();
  // todo: not user friendly, window should hide when user click

  // https://github.com/electron/electron/issues/7259
  // Set "always on top" and then normal again
  // That brings the window on top reliably
  // const wasOnTop = window.isAlwaysOnTop();
  // window.setAlwaysOnTop(true);
  // if (!wasOnTop) {
  //   window.setAlwaysOnTop(false)
  // }

  // https://stackoverflow.com/questions/47160857/show-window-in-electron-without-taking-focus
  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#winshowinactive
  // window.showInactive();
  window.show();
  // window.blur();

  const pos = screen.getCursorScreenPoint();
  window.setPosition(pos.x, pos.y - 80);
  window.moveTop();
}

function hidePopupWindow() {
  const window = getOrCreatePopupWindow();
  window.hide();
}

function createWindow() {
  // create a popup window
  // https://electronjs.org/docs/api/frameless-window
  const window = new BrowserWindow({
    width: Runtime.isDev ? 50 : 50,
    height: 50,
    // width: Runtime.isDev ? 800 : 800,
    // height: 800,
    transparent: true,
    frame: false,
    show: false,
    maximizable: false,
    minimizable: false,
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
  // window.setMenuBarVisibility(false);

  // Load a remote URL
  // https://stackoverflow.com/a/47926513
  window.loadURL(Runtime.isDev
    ? 'http://localhost:3000/#/popup'
    : `file://${path.join(__dirname, '../build/index.html')}#/popup`,
  );

  window.on('closed', () => {
    destroy();
    logger.log(`${WindowId.POPUP} closed`);
  });
  window.once('ready-to-show', () => {
    // window.show();
  });
  // a workaround to set maximizable to false on linux
  // https://stackoverflow.com/questions/58709065/how-to-disable-fullscreen-on-electron-window-linux
  window.on('maximize', () => {
    window.unmaximize();
  });

  window.on('blur', e => {
    logger.log('popup window blur', e);
    window.hide();
  });
  return window;
}
