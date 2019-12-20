import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistConfig } from 'redux-persist/es/types';
import { crossWindowSync } from './redux-cross-window-sync';

const defaultOption = {
  key: 'root',
  storage,
};

export function reduxPersistStoreEnhancer(option: Partial<PersistConfig<any>> = {}) {
  const persistConfig = { ...defaultOption, ...option };
  return createStore => (reducer, initialState) => {
    const persistedReducer = persistReducer(persistConfig, reducer);
    // return createStore(persistedReducer, initialState);

    const store = createStore(persistedReducer, initialState);
    const persistor = persistStore(store);
    crossWindowSync(store, persistConfig);
    return { ...store, persistor };
  };
}