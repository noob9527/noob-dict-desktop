import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { Action, applyMiddleware, combineReducers, compose, createStore, ReducersMapObject } from 'redux';
import { all, takeEvery } from '@redux-saga/core/effects';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import createSagaMiddleware, { Saga } from 'redux-saga';
import { EffectsMapObject, Model } from "./redux-model";

const ReduxApp: React.FC<any> = (props: any) => {
  return (
    <Provider store={props.store}>
      {props.children}
    </Provider>
  )
};

class Dva {
  state: any = {};
  effects: EffectsMapObject = {};
  sagas: Saga[] = [];
  reducers: ReducersMapObject = {};
  rootComponent!: ComponentType;
  history = createBrowserHistory();

  model(model: Model) {
    // state
    this.state[model.namespace] = model.state;

    // reducer
    this.reducers[model.namespace] = (state = model.state, action: Action) => {
      if(!model.reducers) return state;
      // convert namespace/action to action
      const key = action.type.slice(model.namespace.length + 1);
      const reducer = model.reducers[key];
      if (reducer) {
        return reducer(state, action);
      } else {
        return state;
      }
    };

    // effects
    if(model.effects) {
      const effects = Object.entries(model.effects)
        .map(([key, effect]: [string, any]) => {
          return function* () {
            yield takeEvery(`${model.namespace}/${key}`, effect);
          };
        });
      this.effects[model.namespace] = function* () {
        yield all(effects.map(e => e()));
      };
    }

    // sagas
    if(model.sagas) {
      this.sagas = this.sagas.concat(model.sagas);
    }
  }

  router(router: ComponentType) {
    this.rootComponent = router;
  }

  start(element: HTMLElement) {
    const store = this.createStore();
    ReactDOM.render((<ReduxApp store={store}>
      <ConnectedRouter history={this.history}>
        <this.rootComponent/>
      </ConnectedRouter>
    </ReduxApp>), element);
  }

  private createStore(initialState: any = {}) {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducer = combineReducers({
      router: connectRouter(this.history),
      ...this.reducers
    });

    const store = createStore(
      rootReducer,
      initialState,
      compose(
        applyMiddleware(
          routerMiddleware(this.history), // for dispatching history actions
          sagaMiddleware,
          // ... other middlewares ...
        ),
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      ),
    );

    const self = this;
    const rootSaga = function* () {
      yield all([
        ...Object.values(self.effects).map((e: any) => e()),
        ...self.sagas.map((e: any) => e())
      ]);
    };
    sagaMiddleware.run(rootSaga);

    return store;
  }
}

export default function dva() {
  return new Dva();
}

