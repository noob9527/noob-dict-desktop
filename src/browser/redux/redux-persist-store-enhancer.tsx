export {};


// import React from 'react';
// import storage from 'redux-persist/lib/storage';
// import { getStoredState } from 'redux-persist';
// import { REHYDRATE } from 'redux-persist/es/constants';
// import { createReduxPersistStoreEnhancer } from './common/create-redux-persist-store-enhancer';
// import { Store } from 'redux';
// import { ConnectedRouter } from 'connected-react-router';
// import { Spin } from 'antd';
// import { PersistGate } from 'redux-persist/integration/react';
//
// const rootPersistConfig = {
//   key: 'root',
//   storage,
//   blacklist: [
//     // note this blacklist and whitelist only work one level deep
//     // https://github.com/rt2zz/redux-persist#nested-persists
//     'router',
//     '_transient',
//     'setting', // we handle persist setting on our own
//   ],
// };
//
// const reduxPersistStoreEnhancer = createReduxPersistStoreEnhancer(rootPersistConfig);
//
// /**
//  * e.g.
//  * // listen storage event
//  * window.addEventListener(
//  *   'storage',
//  *   createStorageEventHandler(store),
//  *   false,
//  * );
//  * @param store
//  */
// function createStorageEventHandler(store: Store) {
//   async function handleStorageEvent(event: StorageEvent) {
//     // if (event.key == null) return; // this means clearItems is called
//     if (!event.key || event.key === 'redux-persist localStorage test') return;
//     const storedState = await getStoredState(rootPersistConfig);
//     store.dispatch({
//       type: REHYDRATE,
//       key: rootPersistConfig.key,
//       payload: storedState,
//     });
//   }
//
//   return handleStorageEvent;
// }
//
// /**
//  * e.g.
//  * <Provider store={store}>
//  *   {createPersistGate(store, props, history)}
//  * </Provider>
//  * @param store
//  * @param props
//  * @param history
//  */
// function createPersistGate(store, props, history) {
//   return (
//     <PersistGate loading={<Spin/>} persistor={store.persistor}>
//       <ConnectedRouter history={history}>
//         {props.children}
//       </ConnectedRouter>
//     </PersistGate>
//   );
// }
//
// export {
//   rootPersistConfig,
//   reduxPersistStoreEnhancer,
//   createStorageEventHandler,
//   createPersistGate,
// };