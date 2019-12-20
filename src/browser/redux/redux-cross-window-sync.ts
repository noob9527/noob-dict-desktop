import { Store } from 'redux';
import { PersistConfig } from 'redux-persist/es/types';
import { getStoredState } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/es/constants';

// sync state between windows
function crossWindowSync(
  store: Store,
  persistConfig: PersistConfig<any>,
) {
  async function handleStorageEvent() {
    let state = await getStoredState(persistConfig);
    store.dispatch({
      type: REHYDRATE,
      key: persistConfig.key,
      payload: state,
    });
  }
  window.addEventListener('storage', handleStorageEvent, false);
}

export {
  crossWindowSync,
};