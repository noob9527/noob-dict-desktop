import React from 'react';
import App from './app/App';
import { Route, Switch } from 'react-router-dom';
import Test2 from "./test2/Test2";
import SearchPage from "./search/SearchPage";

const PageRouter = () => {
  return (
      <>
        <Switch>
          <Route path="/test1" component={App}/>
          <Route path="/test2" component={Test2}/>
          <Route component={SearchPage}/>
        </Switch>
      </>
  );
};

export default PageRouter;