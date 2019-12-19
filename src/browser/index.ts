import * as models from './pages/models';
import dva from './redux/dva';
import { RootComponent } from './pages/root.component';
import { createHashHistory } from 'history';

const app = dva({
  // electron production mode(load file) cannot use browser history
  // https://stackoverflow.com/a/47926513
  history: createHashHistory(),
});

Object.values(models).forEach((e) => {
  app.model(e);
});

app.router(RootComponent);
app.start(document.getElementById('root')!);
