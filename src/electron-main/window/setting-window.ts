import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import * as path from 'path';
import { mainContainer } from '../../common/container/main-container';
import { getOrCreateSearchWindow } from './search-window';
import logger from '../../common/utils/logger';

export {
  getOrCreateSettingWindow,
  destroy,
};

const SettingWindowToken = Symbol.for('setting-window');
mainContainer.bind<BrowserWindow>(SettingWindowToken).toDynamicValue(createWindow);

function getOrCreateSettingWindow() {
  return mainContainer.get<BrowserWindow>(SettingWindowToken);
}

function destroy() {
  // try to clear the cache and free the memory
  // https://github.com/inversify/InversifyJS/blob/master/wiki/scope.md
  mainContainer.rebind<BrowserWindow>(SettingWindowToken).toDynamicValue(createWindow);
}

function createWindow() {
  // create a modal window
  // https://electronjs.org/docs/api/browser-window#modal-windows
  const window = new BrowserWindow({
    width: isDev ? 1000 : 400,
    height: 300,
    modal: true,
    show: false, // not show until window is ready
    // parent: getOrCreateSearchWindow(),
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
  window.loadURL(isDev
    ? 'http://localhost:3000/#/setting'
    : `file://${path.join(__dirname, '../build/index.html#/setting')}`,
  );
  // window.loadURL(
  //   `file://${path.join(__dirname, '../build/test.html')}`,
  // );

  window.on('closed', () => {
    destroy();
    logger.log(`${SettingWindowToken.description} closed`);
  });
  window.once('ready-to-show', () => {
    window.show();
  });

  if (isDev) {
    // window.webContents.openDevTools();
  }

  return window;
}