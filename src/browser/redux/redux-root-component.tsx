import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { registerStorageEventListener } from '../ipc/ipc-renderer'
import { registerUserChangeListener } from '../utils/axios'
import { RootActions } from '../root-store'

export const createReduxRootComponent = (store, history) => {
  RootActions.init()
  registerStorageEventListener(store)
  registerUserChangeListener(store)
  return (props) => (
    <Provider store={store}>
      <ConnectedRouter history={history}>{props.children}</ConnectedRouter>
    </Provider>
  )
}
