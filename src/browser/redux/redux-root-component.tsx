import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Spin } from 'antd';
import { registerStorageEventListener } from './register-storage-event-listener';

export const createReduxRootComponent = (store, history) => {
  registerStorageEventListener(store, store.persistConfig);
  return (props) => (
    <Provider store={store}>
      {/*<ConnectedRouter history={history}>*/}
      {/*  {props.children}*/}
      {/*</ConnectedRouter>*/}
      <PersistGate loading={<Spin/>} persistor={store.persistor}>
        <ConnectedRouter history={history}>
          {props.children}
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
};
