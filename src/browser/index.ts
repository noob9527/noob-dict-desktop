// for dependency injection
import "reflect-metadata";
import registerAllService from "../electron-browser/services/service-register";
import * as models from './pages/models';
import dva from './redux/dva';
import { RootComponent } from "./pages/root.component";

registerAllService();
const app = dva();

Object.values(models).forEach((e) => {
  app.model(e);
});

app.router(RootComponent);
app.start(document.getElementById('root')!);

