import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Spin } from 'antd';

export const createReduxRootComponent = (store, history) => {
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
