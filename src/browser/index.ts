import './index.css';
import PageRouter from "./pages/PageRouter";
import * as models from './pages/models';
import dva from './redux/dva';

const app = dva();

Object.values(models).forEach(e => {
  app.model(e);
});

app.router(PageRouter);
app.start(document.getElementById('root')!);


