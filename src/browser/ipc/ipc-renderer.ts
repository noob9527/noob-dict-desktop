// sync state between windows
import { Store } from 'redux'
import { ipcRenderer } from 'electron-better-ipc'
import { getCurrentWindowId } from '../utils/window-utils'
import { WindowId } from '../../common/window-id'
import { rendererContainer } from '../../common/container/renderer-container'
import {
  SettingService,
  SettingServiceToken,
} from '../../common/services/setting-service'
import {
  ClipboardService,
  ClipboardServiceToken,
} from '../../common/services/clipboard-service'
import logger from '../../electron-shared/logger'
import { WindowEvent } from '../../common/window-event'
import { SettingChannel } from '../../electron-shared/ipc/ipc-channel-setting'
import { SearchChannel } from '../../electron-shared/ipc/ipc-channel-search'
import { AutoUpdaterChannel } from '../../electron-shared/ipc/ipc-channel-auto-updater'
import { GlobalShotCutChannel } from '../../electron-shared/ipc/ipc-channel-global-shot-cut'
import { LoginChannel } from '../../electron-shared/ipc/ipc-channel-login'
import { settingChanged } from '../pages/setting/setting-store'
import { appHotKeyPressed, handleWindowEvent } from '../pages/transient-store'
import { RootActions } from '../root-store'
import { SyncHistoryChannel } from '../../electron-shared/ipc/ipc-channel-sync-history'
import { SyncActions } from '../pages/sync/sync-store'

function registerStorageEventListener(store: Store) {
  logger.debug('register storage event listener')

  listenAutoUpdaterEvent(store)

  // listen setting change
  ipcRenderer.answerMain(SettingChannel.SETTING_CHANGE, async (data: any) => {
    if (getCurrentWindowId() === WindowId.HOME) {
      const settingService =
        rendererContainer.get<SettingService>(SettingServiceToken)
      await settingService.handleSettingChange(data.newValue, data.oldValue)
    }
    // currently we have to notify both state system..
    store.dispatch({
      type: 'setting/settingChanged',
      payload: data.newValue,
    })
    settingChanged(data.oldValue, data.newValue)
    return data.newValue
  })

  if (getCurrentWindowId() === WindowId.HOME) {
    listenHomeWindowEvent(store)
  }

  listenWindowEvents(store)
}

function listenHomeWindowEvent(store: Store) {
  // listen clipboard event
  const clipboardService = rendererContainer.get<ClipboardService>(
    ClipboardServiceToken,
  )
  clipboardService.onClipboardTextChange((newText, oldText) => {
    store.dispatch({
      type: 'search/clipboardTextChange',
      payload: { newText, oldText },
    })
  })
  // listen global shot cut event
  ipcRenderer.answerMain(GlobalShotCutChannel.APP_HOT_KEY_PRESSED, async () => {
    logger.log(GlobalShotCutChannel.APP_HOT_KEY_PRESSED, new Date())
    appHotKeyPressed()
  })

  // listen search event
  ipcRenderer.answerMain(SearchChannel.SEARCH, async (data: any) => {
    store.dispatch({
      type: 'search/search',
      payload: {
        text: data.text,
      },
    })
  })

  // login code received
  ipcRenderer.answerMain(
    LoginChannel.LOGIN_CODE_RECEIVED,
    async (data: any) => {
      store.dispatch({
        type: 'root/' + LoginChannel.LOGIN_CODE_RECEIVED,
        payload: data,
      })
      RootActions.loginCodeReceived(data.code, data.LoginType, data.LoginOption)
    },
  )

  // listen sync history event
  ipcRenderer.answerMain(
    SyncHistoryChannel.Command.SYNC_SEARCH_HISTORY_COMMAND_START_SILENTLY,
    async (data: any) => {
      await SyncActions.syncHistoryPages(data.pageLimit)
    },
  )
}

function listenAutoUpdaterEvent(store) {
  ipcRenderer.answerMain(AutoUpdaterChannel.CHECKING_FOR_UPDATE, (info) => {
    logger.debug(AutoUpdaterChannel.CHECKING_FOR_UPDATE, info);
  });
  ipcRenderer.answerMain(AutoUpdaterChannel.UPDATE_AVAILABLE, (info) => {
    logger.debug(AutoUpdaterChannel.UPDATE_AVAILABLE, info);
  });
  ipcRenderer.answerMain(AutoUpdaterChannel.UPDATE_NOT_AVAILABLE, (info) => {
    logger.debug(AutoUpdaterChannel.UPDATE_NOT_AVAILABLE, info);
  });
  ipcRenderer.answerMain(AutoUpdaterChannel.ERROR, (err) => {
    logger.debug(AutoUpdaterChannel.ERROR, err);
  });
  ipcRenderer.answerMain(AutoUpdaterChannel.DOWNLOAD_PROGRESS, (progressObj: any) => {
    let logger_message = 'Download speed: ' + progressObj.bytesPerSecond;
    logger_message = logger_message + ' - Downloaded ' + progressObj.percent + '%';
    logger_message = logger_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    logger.debug(AutoUpdaterChannel.DOWNLOAD_PROGRESS, logger_message);
  });
  ipcRenderer.answerMain(AutoUpdaterChannel.UPDATE_DOWNLOADED, (info) => {
    logger.debug(AutoUpdaterChannel.UPDATE_DOWNLOADED, info);
  });
}

function listenWindowEvents(store: Store) {
  WindowId.values().forEach(windowId => {
    WindowEvent.values().forEach(event => {
      const channelName = event.getIpcChannelName(windowId)
      ipcRenderer.answerMain(
        channelName, async () => {
          logger.log(channelName);
          handleWindowEvent(windowId, event)
          store.dispatch({ type: '_transient/' + channelName });
        });
    });
  });
}

export { registerStorageEventListener };
