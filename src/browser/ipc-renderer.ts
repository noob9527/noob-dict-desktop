// sync state between windows
import { Store } from 'redux';
import { ipcRenderer } from 'electron-better-ipc';
import { AutoUpdaterChannel, GlobalShotCutChannel, SearchChannel, SettingChannel } from '../common/ipc-channel';
import { getWindowId } from './utils/window-utils';
import { WindowId } from '../common/window-constants';
import { rendererContainer } from '../common/container/renderer-container';
import { SettingService, SettingServiceToken } from '../common/services/setting-service';
import { ClipboardService, ClipboardServiceToken } from '../common/services/clipboard-service';
import logger from '../common/utils/logger';

function registerStorageEventListener(store: Store) {
  logger.debug('register storage event listener');

  listenAutoUpdaterEvent(store);

  // listen setting change
  ipcRenderer.answerMain(SettingChannel.SETTING_CHANGE, async (data: any) => {
    if (getWindowId() === WindowId.SEARCH) {
      const settingService = rendererContainer.get<SettingService>(SettingServiceToken);
      await settingService.handleSettingChange(data.newValue, data.oldValue);
    }
    store.dispatch({
      type: 'setting/mergeState',
      payload: data.newValue,
    });
    return data.newValue;
  });

  if (getWindowId() === WindowId.SEARCH) {
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
        type: '_transient/toggleSearchWindow',
      });
    });
    // listen setting window event
    ipcRenderer.answerMain(SettingChannel.SETTING_WINDOW_OPENED, async () => {
      store.dispatch({ type: `_transient/${SettingChannel.SETTING_WINDOW_OPENED}`, });
    });
    ipcRenderer.answerMain(SettingChannel.SETTING_WINDOW_CLOSED, async () => {
      store.dispatch({ type: `_transient/${SettingChannel.SETTING_WINDOW_CLOSED}`, });
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
    listenSearchWindowEvent(store);
  }
}

function listenSearchWindowEvent(store) {
  // listen search window event
  ipcRenderer.answerMain(SearchChannel.SEARCH_WINDOW_SHOWED, async () => {
    store.dispatch({ type: '_transient/' + SearchChannel.SEARCH_WINDOW_SHOWED });
  });
  ipcRenderer.answerMain(SearchChannel.SEARCH_WINDOW_HIDED, async () => {
    store.dispatch({ type: '_transient/' + SearchChannel.SEARCH_WINDOW_HIDED });
  });
  ipcRenderer.answerMain(SearchChannel.SEARCH_WINDOW_RESTORED, async () => {
    store.dispatch({ type: '_transient/' + SearchChannel.SEARCH_WINDOW_RESTORED });
  });
  ipcRenderer.answerMain(SearchChannel.SEARCH_WINDOW_MINIMIZED, async () => {
    store.dispatch({ type: '_transient/' + SearchChannel.SEARCH_WINDOW_MINIMIZED });
  });
  ipcRenderer.answerMain(SearchChannel.SEARCH_WINDOW_FOCUS, async () => {
    store.dispatch({ type: '_transient/' + SearchChannel.SEARCH_WINDOW_FOCUS });
  });
  ipcRenderer.answerMain(SearchChannel.SEARCH_WINDOW_BLUR, async () => {
    store.dispatch({ type: '_transient/' + SearchChannel.SEARCH_WINDOW_BLUR });
  });
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

export { registerStorageEventListener };