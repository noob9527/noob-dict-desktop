import './index.css';
import * as serviceWorker from './serviceWorker';
import dva from 'dva';
import * as models from './pages/models';
import routes from './pages/routes';

const app = dva();

Object.values(models).forEach(model => {
  app.model(model);
});

app.router(routes);

app.start('#root');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
