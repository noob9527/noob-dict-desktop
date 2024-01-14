import { BrowserWindow } from 'electron'
import { homeWindowManager } from './home-window'
import { getWindowHashUrl } from '../../electron-shared/path-util'
import { WindowId } from '../../common/window-id'
import * as remoteMain from '@electron/remote/main'
import { Runtime } from '../../electron-shared/runtime'
import path from 'path'
import { AbstractWindowManager } from './window-manager'

class SettingWindowManager extends AbstractWindowManager {
  id: WindowId = WindowId.SETTING

  protected customizedCreate(): BrowserWindow {
    return createWindow()
  }
}

export const settingWindowManager = new SettingWindowManager()

function createWindow() {
  // create a modal window
  // https://electronjs.org/docs/api/browser-window#modal-windows
  const parent = homeWindowManager.getOrCreate()
  const window = new BrowserWindow({
    width: Runtime.isDev ? 1200 : 400,
    height: Runtime.isDev ? 600 : 200,
    maximizable: false,
    minimizable: false,

    // currently in mac, modal window doesn't have close button
    // and cannot be closed
    modal: !Runtime.isMac,
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
  })
  remoteMain.enable(window.webContents)
  window.setMenuBarVisibility(false)

  // Load a remote URL
  // https://stackoverflow.com/a/47926513
  window.loadURL(getWindowHashUrl('setting'))

  window.once('ready-to-show', () => {
    window.show()
  })
  // // currently in mac, modal window doesn't have close button
  // // hence we listen blur event, and close window
  // // https://github.com/electron/electron/issues/30232
  // if (Runtime.isMac) {
  //   window.on('blur', async () => {
  //     close();
  //   });
  // }

  if (Runtime.isDev) {
    window.webContents.openDevTools()
  }

  return window
}
