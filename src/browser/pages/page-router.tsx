import React from 'react';
import App from './app/App';
import { Route, Switch } from 'react-router-dom';
import SettingPage from './setting/setting-page';
import LoginPage from './login/login-page';
import DeveloperPage from './developer/developer-page';
import { MainPage } from './main/main';
import SyncPage from './sync/sync-page';

const PageRouter = () => {
  return (
    <>
      <Switch>
        <Route path="/app" component={App}/>
        <Route path="/main" component={MainPage}/>
        <Route path="/setting" component={SettingPage}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/developer" component={DeveloperPage}/>
        <Route path="/sync" component={SyncPage}/>
        <Route component={MainPage}/>
      </Switch>
    </>
  );
};

export default PageRouter;
