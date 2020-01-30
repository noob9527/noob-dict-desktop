// sync state between windows
import { Store } from 'redux';
import { ipcRenderer } from 'electron-better-ipc';
import { GlobalShotCutChannel, SearchChannel, SettingChannel } from '../../common/ipc-channel';
import { getWindowIdentifier } from '../utils/window-utils';
import { WindowIdentifier } from '../../common/window-constants';
import { rendererContainer } from '../../common/container/renderer-container';
import { SettingService, SettingServiceToken } from '../../common/services/setting-service';
import { ClipboardService, ClipboardServiceToken } from '../../common/services/clipboard-service';

function registerStorageEventListener(store: Store) {
  console.debug('register storage event listener');

  // listen setting change
  ipcRenderer.answerMain(SettingChannel.SETTING_CHANGE, async (data: any) => {
    if (getWindowIdentifier() === WindowIdentifier.SEARCH) {
      const settingService = rendererContainer.get<SettingService>(SettingServiceToken);
      await settingService.handleSettingChange(data.newValue, data.oldValue);
    }
    store.dispatch({
      type: 'setting/mergeState',
      payload: data.newValue,
    });
    return data.newValue;
  });

  if (getWindowIdentifier() === WindowIdentifier.SEARCH) {
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
      store.dispatch({
        type: '_transient/toggleSearchWindow',
      });
    });
    // listen setting window close event
    ipcRenderer.answerMain(SettingChannel.SETTING_WINDOW_CLOSED, async () => {
      store.dispatch({
        type: '_transient/mergeState',
        payload: {
          isSettingWindowOpen: false,
        },
      });
    });
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
}

export { registerStorageEventListener };