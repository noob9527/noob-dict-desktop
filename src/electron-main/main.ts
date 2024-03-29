// Modules to control application life and create native browser window
import './ipc/ipc-main'
import { app, globalShortcut, Menu } from 'electron'
import logger from '../electron-shared/logger'
import { homeWindowManager } from './window/home-window'
import globalState from './global-state'
import contextMenu from 'electron-context-menu'
import { initSetting } from './setting'
import { getOrCreateAppMenu } from './menu'
import { initialAutoUpdater } from './auto-update'
import * as remoteMain from '@electron/remote/main'
import { Env } from '../electron-shared/env'
import { SearchHistorySyncTimer } from './services/search-history-sync-timer';

// see https://github.com/electron/remote
remoteMain.initialize()

// verify env
logger.debug('REACT_APP_ENV_LOAD_FLAG', Env.REACT_APP_ENV_LOAD_FLAG)
if (!Env.REACT_APP_ENV_LOAD_FLAG) {
  throw new Error('failed to load env')
}

contextMenu({
  showInspectElement: true,
  labels: {
    inspect: 'inspect',
  },
})

// Make this app a single instance app.
if (!app.requestSingleInstanceLock()) {
  app.quit()
}
app.on('second-instance', () => {
  logger.log('second-instance')
  homeWindowManager.show()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  homeWindowManager.getOrCreate()

  initSetting()

  Menu.setApplicationMenu(getOrCreateAppMenu())

  initialAutoUpdater()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
  //   app.quit();
  // }

  // we do not quit the app here
  logger.log('window-all-closed')
})

// On OS X it"s common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  homeWindowManager.getOrCreate()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  SearchHistorySyncTimer.destroy()
})

app.on('before-quit', () => {
  globalState.trayQuitPressed = true
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// suppress the annoying error message
// => [.DisplayCompositor]GL ERROR :GL_INVALID_OPERATION : glBufferData: <- error from previous GL command
// https://github.com/electron/electron/issues/7834
// https://github.com/electron/electron/issues/12820
app.disableHardwareAcceleration()
