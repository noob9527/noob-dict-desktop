import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { registerStorageEventListener } from '../ipc/ipc-renderer'
import { registerUserChangeListener } from '../utils/api-axios'
import { RootActions } from '../root-store'

export const createReduxRootComponent = (store, history) => {
  // for backward compatibility
  // todo: remove in future
  store.dispatch({
    type: 'root/init',
  });
  registerStorageEventListener(store)
  registerUserChangeListener()
  // the order matters!
  // we need to load use after we subscribe.
  // otherwise the 1st update cannot be emitted to the listener.
  RootActions.init()

  return (props) => {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>{props.children}</ConnectedRouter>
      </Provider>
    )
  }
}
