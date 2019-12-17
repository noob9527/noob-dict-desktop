import React from 'react';
import App from './app/App';
import { Route, Switch } from 'react-router-dom';
import Test2 from "./test2/Test2";
import SearchPage from "./search/search-page";
import SettingPage from "./setting/setting-page";

const PageRouter = () => {
  return (
      <>
        <Switch>
          {/*<Route path="/test1" component={SearchPage}/>*/}
          <Route path="/test1" component={App}/>
          <Route path="/test2" component={Test2}/>
          <Route path="/search" component={SearchPage}/>
          <Route path="/setting" component={SettingPage}/>
          <Route component={SearchPage}/>
        </Switch>
      </>
  );
};

export default PageRouter;