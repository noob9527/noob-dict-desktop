import { Store } from 'redux';
import { PersistConfig } from 'redux-persist/es/types';
import { getStoredState } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/es/constants';

// sync state between windows
function registerStorageEventListener(
  store: Store,
  persistConfig: PersistConfig<any>,
) {
  console.debug('register storage event listener');
  window.addEventListener('storage', handleStorageEvent, false);

  // todo: how do we avoid dispatch action twice ??
  // Namely, dispatch an action -> change state -> change storage -> fire storage event -> dispatch rehydrate action
  // It seems like we don't have this issue now, but I don't know why...
  async function handleStorageEvent() {
    // const currentState = store.getState();
    // todo: all setting, and pin have side effect, sync doesn't enough
    const storedState = await getStoredState(persistConfig);
    store.dispatch({
      type: REHYDRATE,
      key: persistConfig.key,
      payload: storedState,
    });
  }
}

export {
  registerStorageEventListener,
};