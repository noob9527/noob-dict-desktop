import { BrowserWindow, screen } from 'electron';
import isDev from 'electron-is-dev';
import * as path from 'path';
import { mainContainer } from '../../common/container/main-container';
import logger from '../../common/utils/logger';
import { ipcMain } from "electron-better-ipc";
import { SearchChannel } from "../../common/ipc-channel";

export {
  getOrCreatePopupWindow,
  showPopupWindow,
  hidePopupWindow,
  destroy,
};

const PopupWindowToken = Symbol.for('popup-window');
mainContainer.bind<BrowserWindow>(PopupWindowToken).toDynamicValue(createWindow);

function getOrCreatePopupWindow() {
  return mainContainer.get<BrowserWindow>(PopupWindowToken);
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

function destroy() {
  // try to clear the cache and free the memory
  // https://github.com/inversify/InversifyJS/blob/master/wiki/scope.md
  mainContainer.rebind<BrowserWindow>(PopupWindowToken).toDynamicValue(createWindow);
}

function createWindow() {
  // create a popup window
  // https://electronjs.org/docs/api/frameless-window
  const window = new BrowserWindow({
    width: isDev ? 50 : 50,
    height: 50,
    // width: isDev ? 800 : 800,
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
      // to disable the cors policy, so that we can fetch resources from different origin
      webSecurity: false,
    },
  });
  // window.setMenuBarVisibility(false);

  // Load a remote URL
  // https://stackoverflow.com/a/47926513
  window.loadURL(isDev
    ? 'http://localhost:3000/#/popup'
    : `file://${path.join(__dirname, '../build/index.html')}#/popup`,
  );

  window.on('closed', () => {
    destroy();
    logger.log(`${PopupWindowToken.description} closed`);
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
