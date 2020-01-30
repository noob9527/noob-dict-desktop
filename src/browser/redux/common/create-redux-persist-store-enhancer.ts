export {};


// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { PersistConfig } from 'redux-persist/es/types';
//
// const defaultOption = {
//   key: 'root',
//   storage,
// };
//
// // PersistConfig => StoreEnhancer
// export function createReduxPersistStoreEnhancer(option: Partial<PersistConfig<any>> = {}) {
//   const persistConfig = { ...defaultOption, ...option };
//   return createStore => (reducer, initialState) => {
//     const persistedReducer = persistReducer(persistConfig, reducer);
//     // const persistedReducer = reducer;
//     const store = createStore(persistedReducer, initialState);
//     const persistor = persistStore(store);
//     return { ...store, persistor, persistConfig };
//   };
// }
//
//
