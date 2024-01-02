import { BrowserWindow } from 'electron';
import { getOrCreateSearchWindow } from './search-window';
import logger from '../../electron-shared/logger';
import { ipcMain } from 'electron-better-ipc';
import { getWindowHashUrl } from '../../electron-shared/path-util';
import { windowContainer } from './windows';
import { WindowId } from '../../common/window-id';
import { extractCode, getLoginOption, getLoginType, githubOption } from '../../common/social-login';
import * as remoteMain from '@electron/remote/main';
import { Runtime } from '../../electron-shared/runtime';
import { notifyRendererWindowEvents } from '../utils/window-util';
import { LoginChannel } from '../../electron-shared/ipc/ipc-channel-login';
import path from 'path';

export {
  getOrCreateLoginWindow,
};

function getOrCreateLoginWindow() {
  return windowContainer.find(WindowId.LOGIN)
    ?? windowContainer.add(WindowId.LOGIN, createWindow());
}

function close() {
  const window = windowContainer.find(WindowId.LOGIN);
  if (window == null) return;
  window.close();
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
    width: Runtime.isDev ? 400 : 400,
    height: 200,
    // width: 1020,
    // height: 752,
    maximizable: false,
    minimizable: false,
    modal: true,
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
  const loginWindowUrl = getWindowHashUrl('login')
  window.loadURL(loginWindowUrl);
  if (!(githubOption.params.redirect_uri && githubOption.params.client_id)) {
    throw new Error('"client_id" and "redirect_uri" are required')
  }

  // this works when we don't have related cookie(e.g. the first time we login)
  // see https://auth0.com/blog/securing-electron-applications-with-openid-connect-and-oauth-2/
  const filter = {
    urls: [`${githubOption.params.redirect_uri}*`],
  };
  logger.debug('[onBeforeRequest] register filter:', filter);
  window.webContents.session.webRequest.onBeforeRequest(filter, async ({ url }) => {
    logger.debug('[onBeforeRequest] url:', url);
    const code = extractCode(url);
    logger.debug('[onBeforeRequest] extract code:', code);
    if (code) {
      // Close the browser if code found or error
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

  // this only works when we have corresponding cookie
  // we keep this block cuz it produces better user experience(it won't create then close a blank window)
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
    // to mimic the 1st time login behavior
    // session.defaultSession.clearStorageData({
    //   storages: ['cookies'],
    // });
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
  notifyRendererWindowEvents(WindowId.LOGIN, window, parent)

  // if (Runtime.isDev) {
  //   window.webContents.openDevTools();
  // }

  return window;
}
