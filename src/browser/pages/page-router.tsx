import React from 'react';
import App from './app/App';
import { Route, Switch } from 'react-router-dom';
import SettingPage from './setting/setting-page';
import PopupPage from './popup/popup-page';
import LoginPage from './login/login-page';
import DeveloperPage from './developer/developer-page';
import { MainPage } from './main/main';

const PageRouter = () => {
  return (
    <>
      <Switch>
        <Route path="/app" component={App}/>
        <Route path="/main" component={MainPage}/>
        <Route path="/setting" component={SettingPage}/>
        <Route path="/popup" component={PopupPage}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/developer" component={DeveloperPage}/>
        <Route component={MainPage}/>
      </Switch>
    </>
  );
};

export default PageRouter;
