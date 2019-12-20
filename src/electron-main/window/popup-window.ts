import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import * as path from 'path';
import { mainContainer } from '../../common/container/main-container';
import logger from '../../common/utils/logger';

export {
  getOrCreatePopupWindow,
  showPopupWindow,
  destroy,
};

const PopupWindowToken = Symbol.for('popup-window');
mainContainer.bind<BrowserWindow>(PopupWindowToken).toDynamicValue(createWindow);

function getOrCreatePopupWindow() {
  return mainContainer.get<BrowserWindow>(PopupWindowToken);
}

function showPopupWindow() {
  const window = getOrCreatePopupWindow();
  window.show();
  // if (window) {
  //   if (window.isMinimized()) window.restore();
  //   window.show();
  // } else {
  //   logger.error('somehow window doesn\'t exist');
  // }
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
    width: isDev ? 800 : 800,
    height: 600,
    transparent: true,
    frame: false,
    show: false,
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
    : `file://${path.join(__dirname, '../build/index.html#/popup')}`,
  );

  window.on('closed', () => {
    destroy();
    logger.log(`${PopupWindowToken.description} closed`);
  });
  window.once('ready-to-show', () => {
    // window.show();
  });
  return window;
}
