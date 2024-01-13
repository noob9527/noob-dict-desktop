import { app, BrowserWindow, session } from 'electron'
import logger from '../../electron-shared/logger'
import { getOrCreateTray } from '../tray/tray'
import * as path from 'path'
import globalState from '../global-state'
import * as os from 'os'
import * as fs from 'fs'
import { getIconPath, getWindowHashUrl } from '../../electron-shared/path-util'
import { ipcMain } from 'electron-better-ipc'
import { WindowId } from '../../common/window-id'
import * as remoteMain from '@electron/remote/main'
import { Runtime } from '../../electron-shared/runtime'
import { AppChannel } from '../../electron-shared/ipc/ipc-channel-app'
import { AbstractWindowManager } from './abstract-window-manager'

class HomeWindowManager extends AbstractWindowManager {
  id: WindowId = WindowId.HOME

  customizedCreate(): BrowserWindow {
    return createWindow()
  }
}

export const homeWindowManager = new HomeWindowManager()

function createWindow() {
  const window = new BrowserWindow({
    width: Runtime.isDev ? 1600 : 1200,
    height: 900,
    icon: getIconPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      // preload: path.join(__dirname, "preload.js"),
      // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
      nodeIntegration: true,
      // // see https://github.com/electron-userland/electron-forge/issues/2567
      contextIsolation: false,
      // to disable the cors policy, so that we can fetch resources from different origin
      webSecurity: false,
    },

    // https://www.electronjs.org/docs/api/browser-window#showing-window-gracefully
    show: false, // not show until window is ready
    backgroundColor: '#2e2c29',

    // doesn't work on linux
    // https://electronjs.org/docs/api/browser-window
    minimizable: false,
    maximizable: false,
  })
  remoteMain.enable(window.webContents)

  // remove menu bar
  // https://stackoverflow.com/questions/39091964/remove-menubar-from-electron-app
  // window.setMenuBarVisibility(false); // turns out this is the only work way to hide the menu bar
  // window.setMenu(null);
  // window.removeMenu();
  // Menu.setApplicationMenu(null);
  // window.setAutoHideMenuBar(true);

  window.loadURL(getWindowHashUrl('main/search'))

  window.once('ready-to-show', () => {
    if (!process.argv.includes('--background')) {
      window.show()
    }
  })

  // let allowAppQuit = false;
  // todo: vite
  let allowAppQuit = true

  window.on('close', async (e) => {
    // close to tray
    // https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
    if (!globalState.isQuiting) {
      e.preventDefault()
      window.hide()
    } else {
      if (!allowAppQuit) {
        e.preventDefault()
        logger.log('app is quiting')
        allowAppQuit = (await ipcMain.callRenderer(
          window,
          AppChannel.APP_QUITING,
        )) as boolean
        if (allowAppQuit) {
          logger.log('app is ready to quit')
          app.quit()
        }
      }
    }
  })

  window.webContents.on('did-finish-load', () => {
    getOrCreateTray()
    logger.log('did-finish-load')
  })
  // stop link from opening new window
  // https://stackoverflow.com/questions/46462248/electron-link-opens-in-new-window
  // window.webContents.on('new-window', (event) => {
  //   event.preventDefault();
  // });
  // https://www.electronjs.org/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler
  window.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })

  if (Runtime.isDev) {
    // Open the DevTools.
    window.webContents.openDevTools()
    // add devtools
    let extensionRelativeFolder: string
    if (Runtime.isMac) {
      extensionRelativeFolder =
        'Library/Application Support/Google/Chrome/Default/Extensions'
    } else {
      extensionRelativeFolder = '.config/google-chrome/Default/Extensions'
    }
    const extensionDir = path.join(os.homedir(), extensionRelativeFolder)
    // const reactDir = path.join(extensionDir, 'fmkadmapgofadopljbjfkapdkoienihi');
    const reduxDir = path.join(extensionDir, 'lmhkpmbekcpmknklioeibfkpmmfibljd')
    // somehow react devtools doesn't work
    // Message: Uncaught TypeError: Cannot read properties of undefined (reading 'ExecutionWorld')
    // https://github.com/electron/electron/issues/36545
    // if (fs.existsSync(reactDir)) {
    //   const react = fs.readdirSync(reactDir);
    //   if (react.length) {
    //     const reactExt = path.join(reactDir, react[react.length - 1]);
    //     console.log(`load react dev tools from: ${reactExt}`);
    //     session.defaultSession.loadExtension(reactExt);
    //   }
    // }
    if (fs.existsSync(reduxDir)) {
      const redux = fs.readdirSync(reduxDir)
      if (redux.length) {
        const reduxExt = path.join(reduxDir, redux[redux.length - 1])
        console.log(`load redux dev tools from: ${reduxExt}`)
        session.defaultSession.loadExtension(reduxExt)
      }
    }
  }

  return window
}
