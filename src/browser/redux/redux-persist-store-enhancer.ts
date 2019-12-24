import storage from 'redux-persist/lib/storage';
import { createReduxPersistStoreEnhancer } from './common/create-redux-persist-store-enhancer';
import { rendererContainer } from '../../common/container/renderer-container';
import { SettingStorageService, SettingStorageServiceToken } from '../services/setting-storage-service';
import { Store } from 'redux';
import { getStoredState } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/es/constants';
import { getWindowIdentifier } from '../utils/window-utils';
import { WindowIdentifier } from '../../common/window-constants';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: [
    // note this blacklist and whitelist only work one level deep
    // https://github.com/rt2zz/redux-persist#nested-persists
    'router',
    '_transient',
    'setting', // we use "Nested Persists" to handle persist setting
  ],
};

const settingStorageService = rendererContainer.get<SettingStorageService>(SettingStorageServiceToken);

const settingPersistConfig = {
  key: 'setting',
  // storage: storageSession,
  // storage: storage,
  storage: settingStorageService.getSettingStorage(),
  // blacklist: [],
};

const reduxPersistStoreEnhancer = createReduxPersistStoreEnhancer(rootPersistConfig);

// sync state between windows
function registerStorageEventListener(store: Store) {
  console.debug('register storage event listener');

  window.addEventListener('storage', handleStorageEvent, false);
  if (getWindowIdentifier() === WindowIdentifier.SEARCH) {
    // todo: this cause rehydrate fire twice
    settingStorageService.onDidAnyChange((newValue, oldValue) => {
      console.log(newValue, oldValue);
      getStoredState(settingPersistConfig).then((state) => {
        store.dispatch({
          type: REHYDRATE,
          key: settingPersistConfig.key,
          payload: state,
        });
      });
    });
  }

  // todo: how do we avoid dispatch action twice ??
  // Namely, dispatch an action -> change state -> change storage -> fire storage event -> dispatch rehydrate action
  // It seems like we don't have this issue now, but I don't know why...
  async function handleStorageEvent(event: StorageEvent) {
    // if (event.key == null) return; // this means clearItems is called
    // todo: all setting, and pin have side effect, sync doesn't enough
    // this is root persist config
    console.log(event);
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
  settingPersistConfig,
  reduxPersistStoreEnhancer,
  registerStorageEventListener,
};