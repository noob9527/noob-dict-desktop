import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { registerStorageEventListener } from '../ipc-renderer';

export const createReduxRootComponent = (store, history) => {
  store.dispatch({
    type: 'setting/init',
  });
  registerStorageEventListener(store);
  return (props) => (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {props.children}
      </ConnectedRouter>
    </Provider>
  );
};
