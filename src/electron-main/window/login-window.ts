import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { getOrCreateSearchWindow } from './search-window';
import logger from '../../common/utils/logger';
import { ipcMain } from 'electron-better-ipc';
import { LoginChannel } from '../../common/ipc-channel';
import { getWindowHashUrl } from '../utils/path-util';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-constants';
import { extractCode, getLoginOption, getLoginType } from '../../common/social-login';

export {
  getOrCreateLoginWindow,
};

function getOrCreateLoginWindow() {
  return windowContainer.find(WindowId.LOGIN)
    ?? windowContainer.add(WindowId.LOGIN, createWindow());
}

function destroy() {
  logger.log('destroy login window');
  windowContainer.remove(WindowId.LOGIN);
}

function createWindow() {
  logger.log('create login window');
  // create a modal window
  // https://electronjs.org/docs/api/browser-window#modal-windows
  const parent = getOrCreateSearchWindow();
  const window = new BrowserWindow({
    width: isDev ? 400 : 400,
    height: 200,
    // width: 1020,
    // height: 752,
    modal: true,
    resizable: isDev,

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
  window.loadURL(getWindowHashUrl('login'));

  // we handle success login event here
  window.webContents.on('will-redirect', (event, url, ...args) => {
    const oldUrl = window.webContents.getURL();

    logger.debug('[will-redirect] old url:', oldUrl);
    logger.debug('[will-redirect] new url:', url);

    const code = extractCode(url);
    logger.debug('[will-redirect] extract code:', code);
    if (code) {
      // Close the browser if code found or error
      event.preventDefault(); // prevent redirect
      window.close();

      const loginType = getLoginType(url);
      logger.debug('[will-redirect] loginType:', loginType);
      if (!loginType) return;
      const loginOption = getLoginOption(loginType);
      // logger.debug('[will-redirect] loginOption:', loginOption);

      ipcMain.callRenderer(parent, LoginChannel.LOGIN_CODE_RECEIVED, {
        code,
        loginType,
        loginOption,
      });
    }
  });

  // we handle redirect to oauth2 vendor authorization page event here
  window.webContents.on('did-redirect-navigation', (event, url) => {
    logger.debug('[did-redirect-navigation]', url);
    const loginType = getLoginType(url);
    logger.debug('[did-redirect-navigation] login type:', loginType);
    if (!loginType) return;
    const loginOption = getLoginOption(loginType);

    const windowSize = loginOption.windowSize;
    if (windowSize) {
      window.setContentSize(windowSize.width, windowSize.height);
    }
  });

  window.once('ready-to-show', () => {
    window.show();
  });
  window.on('show', e => {
    logger.log('login window show');
    ipcMain.callRenderer(parent, LoginChannel.LOGIN_WINDOW_OPENED, e);
  });
  window.on('closed', async () => {
    ipcMain.callRenderer(parent, LoginChannel.LOGIN_WINDOW_CLOSED);
    destroy();
    logger.log(`${WindowId.LOGIN} closed`);
  });

  // if (isDev) {
  //   window.webContents.openDevTools();
  // }

  return window;
}