import * as models from './pages/models';
import dva from './redux/dva';
import { RootComponent } from './pages/root.component';
import { createHashHistory } from 'history';
import { reduxPersistStoreEnhancer } from './redux/redux-persist-store-enhancer';
import { createReduxRootComponent } from './redux/redux-root-component';
import { getWindowIdentifier } from './utils/window-utils';

const app = dva({
  // electron production mode(load file) cannot use browser history
  // https://stackoverflow.com/a/47926513
  history: createHashHistory(),
  extraEnhancers: [reduxPersistStoreEnhancer({
    blacklist: [
      // note that blacklist and whitelist only work one level deep
      // https://github.com/rt2zz/redux-persist#nested-persists
      'router', '_transient', 'sideEffect',
    ],
  })],
  createRootComponent: createReduxRootComponent,
  initialState: {
    _transient: {
      windowIdentifier: getWindowIdentifier(),
    },
  },
});

Object.values(models).forEach((e) => {
  app.model(e);
});

app.router(RootComponent);
app.start(document.getElementById('root')!);
