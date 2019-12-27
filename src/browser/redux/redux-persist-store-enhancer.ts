import storage from 'redux-persist/lib/storage';
import { createReduxPersistStoreEnhancer } from './common/create-redux-persist-store-enhancer';
import { rendererContainer } from '../../common/container/renderer-container';
import { Store } from 'redux';
import { getStoredState } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/es/constants';
import { getWindowIdentifier } from '../utils/window-utils';
import { WindowIdentifier } from '../../common/window-constants';
import { ipcRenderer } from 'electron-better-ipc';
import { GlobalShotCutChannel, SearchChannel, SettingChannel } from '../../common/ipc-channel';
import { SettingService, SettingServiceToken } from '../../common/services/setting-service';
import { ClipboardService, ClipboardServiceToken } from '../../common/services/clipboard-service';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: [
    // note this blacklist and whitelist only work one level deep
    // https://github.com/rt2zz/redux-persist#nested-persists
    'router',
    '_transient',
    'setting', // we handle persist setting on our own
  ],
};

const reduxPersistStoreEnhancer = createReduxPersistStoreEnhancer(rootPersistConfig);

// sync state between windows
function registerStorageEventListener(store: Store) {
  console.debug('register storage event listener');

  // listen storage
  window.addEventListener('storage', handleStorageEvent, false);

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

  // todo: how do we avoid dispatch action twice ??
  // Namely, dispatch an action -> change state -> change storage -> fire storage event -> dispatch rehydrate action
  // It seems like we don't have this issue now, but I don't know why...
  async function handleStorageEvent(event: StorageEvent) {
    // if (event.key == null) return; // this means clearItems is called
    if (!event.key || event.key === 'redux-persist localStorage test') return;
    const storedState = await getStoredState(rootPersistConfig);
    store.dispatch({
      type: REHYDRATE,
      key: rootPersistConfig.key,
      payload: storedState,
    });
  }
}


export {
  rootPersistConfig,
  reduxPersistStoreEnhancer,
  registerStorageEventListener,
};