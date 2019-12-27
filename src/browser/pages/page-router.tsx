import React from 'react';
import App from './app/App';
import { Route, Switch } from 'react-router-dom';
import SearchPage from './search/search-page';
import SettingPage from './setting/setting-page';
import PopupPage from './popup/popup-page';

const PageRouter = () => {
  return (
    <>
      <Switch>
        <Route path="/test1" component={App}/>
        <Route path="/search" component={SearchPage}/>
        <Route path="/setting" component={SettingPage}/>
        <Route path="/popup" component={PopupPage}/>
        <Route component={SearchPage}/>
      </Switch>
    </>
  );
};

export default PageRouter;