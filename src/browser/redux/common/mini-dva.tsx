import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  createStore, Reducer,
  ReducersMapObject,
  Store,
  StoreEnhancer,
} from 'redux';
import { all, takeEvery } from '@redux-saga/core/effects';
import { createBrowserHistory, History } from 'history';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import createSagaMiddleware, { Saga } from 'redux-saga';
import { EffectsMapObject, Model } from './redux-model';

interface DvaOption {
  history: History<any>
  extraEnhancers: StoreEnhancer[]
  createRootComponent: (store, history) => ComponentType
}

const defaultOption: DvaOption = {
  history: createBrowserHistory(),
  extraEnhancers: [],
  createRootComponent: (store, history) => (props) =>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {props.children}
      </ConnectedRouter>
    </Provider>,
};

/**
 * A simplified dva
 */
export default class MiniDva {
  state: any = {};  // globalState
  _store: Store | null = null;
  effects: EffectsMapObject = {};
  sagas: Saga[] = [];
  _rootReducer: Reducer<any> | null = null;
  reducers: ReducersMapObject = {};
  routerComponent!: ComponentType;
  history: History<any>;
  extraEnhancers: StoreEnhancer[];
  createRootComponent: (store, history) => ComponentType;

  constructor(
    option: Partial<DvaOption>,
  ) {
    const opt = { ...defaultOption, ...option };
    this.history = opt.history;
    this.extraEnhancers = opt.extraEnhancers;
    this.createRootComponent = opt.createRootComponent;
  }

  model(model: Model) {
    // state
    this.state[model.namespace] = model.state;

    // reducer
    let reducer = (state = model.state, action: Action) => {
      if (!model.reducers) return state;

      if (!action.type.startsWith(model.namespace)) return state;
      // convert namespace/action to action
      const key = action.type.slice(model.namespace.length + 1);

      const reducer = model.reducers[key];
      if (reducer) {
        return reducer(state, action);
      } else {
        return state;
      }
    };
    if (model.__unstableReducerEnhancer) reducer = model.__unstableReducerEnhancer(reducer);
    this.reducers[model.namespace] = reducer;

    // effects
    if (model.effects) {
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
    if (model.sagas) {
      this.sagas = this.sagas.concat(model.sagas);
    }
  }

  router(router: ComponentType) {
    this.routerComponent = router;
  }

  start(element: HTMLElement) {
    this.getOrCreateStore();
    // got to start with a capital letter
    // https://stackoverflow.com/questions/37414304/typescript-complains-property-does-not-exist-on-type-jsx-intrinsicelements-whe
    const Root = this.createRootComponent(this._store, this.history);
    ReactDOM.render(<Root>
      <this.routerComponent/>
    </Root>, element);
  }

  private getOrCreateRootReducer() {
    if (this._rootReducer) return this._rootReducer
    this._rootReducer = combineReducers({
      router: connectRouter(this.history),
      ...this.reducers,
    })
    return this._rootReducer
  }

  private getOrCreateStore() {
    if (this._store) return;

    const sagaMiddleware = createSagaMiddleware();
    const rootReducer = this.getOrCreateRootReducer()

    // @ts-ignore
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
      rootReducer,
      this.state,
      composeEnhancers(
        applyMiddleware(
          routerMiddleware(this.history), // for dispatching history actions
          sagaMiddleware,
          // ... other middlewares ...
        ),
        ...this.extraEnhancers,
      ),
    );

    const self = this;
    const rootSaga = function* () {
      yield all([
        ...Object.values(self.effects).map((e: any) => e()),
        ...self.sagas.map((e: any) => e()),
      ]);
    };
    sagaMiddleware.run(rootSaga);
    this._store = store;
  }
}
