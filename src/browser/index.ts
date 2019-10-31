import * as models from './pages/models';
import dva from './redux/dva';
import { RootComponent } from "./pages/root.component";

const app = dva();

Object.values(models).forEach((e) => {
  app.model(e);
});

app.router(RootComponent);
app.start(document.getElementById('root')!);


