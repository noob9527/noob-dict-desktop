import React from 'react';
import App from './app/App';
import { router as dvaRouter, Router as DvaRouter, RouterAPI } from 'dva';
import Page from "./Pages";
import SearchPage from "./search/SearchPage";
import Test2 from "./test2/Test2";

const { Route, Router, Switch } = dvaRouter;

const router: DvaRouter = (api?: RouterAPI) => {
  // DVA BUG
  // I guess there's something wrong in dva's type declaration
  // this should never happen
  if (api == null) throw new Error('api is undefined');

  return (
    <Router history={api.history}>
      <Page>
        <Switch>
          <Route path="/test1" component={App}/>
          <Route path="/test2" component={Test2}/>
          <Route component={SearchPage}/>
        </Switch>
      </Page>
    </Router>
  );
};

export default router;