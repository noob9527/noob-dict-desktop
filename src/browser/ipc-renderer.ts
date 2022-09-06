// sync state between windows
import { Store } from 'redux';
import { ipcRenderer } from 'electron-better-ipc';
import {
  AppChannel,
  AutoUpdaterChannel,
  GlobalShotCutChannel,
  LoginChannel,
  SearchChannel,
  SettingChannel,
} from '../common/ipc-channel';
import { getCurrentWindowId } from './utils/window-utils';
import { WindowId } from '../common/window-id';
import { rendererContainer } from '../common/container/renderer-container';
import { SettingService, SettingServiceToken } from '../common/services/setting-service';
import { ClipboardService, ClipboardServiceToken } from '../common/services/clipboard-service';
import logger from '../electron-shared/logger';
import { GlobalHistoryService, GlobalHistoryServiceToken } from '../common/services/global-history-service';
import { WindowEvents } from '../common/window-events';

function registerStorageEventListener(store: Store) {
  logger.debug('register storage event listener');

  listenAutoUpdaterEvent(store);

  // listen setting change
  ipcRenderer.answerMain(SettingChannel.SETTING_CHANGE, async (data: any) => {
    if (getCurrentWindowId()===WindowId.SEARCH) {
      const settingService = rendererContainer.get<SettingService>(SettingServiceToken);
      await settingService.handleSettingChange(data.newValue, data.oldValue);
    }
    store.dispatch({
      type: 'setting/settingChanged',
      payload: data.newValue,
    });
    return data.newValue;
  });

  if (getCurrentWindowId()===WindowId.SEARCH) {
    // listen clipboard event
    const clipboardService = rendererContainer.get<ClipboardService>(ClipboardServiceToken);
    clipboardService.onClipboardTextChange(((newText, oldText) => {
      store.dispatch({
        type: 'search/clipboardTextChange',
        payload: { newText, oldText },
      });
    }));
    clipboardService.onSelectionTextChange((newText, oldText) => {
      store.dispatch({
        type: 'search/selectionTextChange',
        payload: { newText, oldText },
      });
    });
    // listen global shot cut event
    ipcRenderer.answerMain(GlobalShotCutChannel.APP_HOT_KEY_PRESSED, async () => {
      logger.log(GlobalShotCutChannel.APP_HOT_KEY_PRESSED, new Date());
      store.dispatch({
        type: '_transient/appHotKeyPressed',
      });
    });
    // listen app event
    ipcRenderer.answerMain(AppChannel.APP_QUITING, async () => {
      store.dispatch({ type: `_transient/${AppChannel.APP_QUITING}`, });
      const globalHistoryService = rendererContainer.get<GlobalHistoryService>(GlobalHistoryServiceToken);
      logger.log('about to sync history');
      await globalHistoryService.syncHistories();
      logger.log('sync history success!');
      return true;
    });

    // listen search event
    ipcRenderer.answerMain(SearchChannel.SEARCH, async (data: any) => {
      store.dispatch({
        type: 'search/search',
        payload: {
          text: data.text
        },
      });
    });

    // login code received
    ipcRenderer.answerMain(LoginChannel.LOGIN_CODE_RECEIVED, async (data) => {
      store.dispatch({
        type: 'root/' + LoginChannel.LOGIN_CODE_RECEIVED,
        payload: data,
      });
    });
  }
  listenWindowEvents(store);
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
    WindowEvents.values().forEach(event => {
      const channelName = windowId.getEventChannelName(event);
      ipcRenderer.answerMain(
        channelName, async () => {
          logger.log(channelName);
          store.dispatch({ type: '_transient/' + channelName });
        });
    });
  });
}

export { registerStorageEventListener };
