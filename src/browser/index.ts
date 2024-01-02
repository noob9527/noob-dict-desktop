// As we don't use webpack anymore.
// seems like we have to load the antd.css all at once.
import 'antd/dist/antd.css';
import * as models from './pages/models';
import dva from './redux/common/dva';
import { RootComponent } from './pages/root.component';
import { createHashHistory } from 'history';
import { createReduxRootComponent } from './redux/redux-root-component';

const app = dva({
  // electron production mode(load file) cannot use browser history
  // https://stackoverflow.com/a/47926513
  history: createHashHistory(),
  // extraEnhancers: [reduxPersistStoreEnhancer],
  createRootComponent: createReduxRootComponent,
});

Object.values(models).forEach((e) => {
  app.model(e);
});

app.router(RootComponent);
app.start(document.getElementById('root')!);
