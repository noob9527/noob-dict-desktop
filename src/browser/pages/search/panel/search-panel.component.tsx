import React from 'react';
import SearchPanelHeader from "../panel-header/search-panel-header.component";
import { Route, Switch } from "react-router-dom";
import App from "../../app/App";
import Test2 from "../../test2/Test2";
import SearchPage from "../search-page";



export default () => {
  return (
    <>
      <SearchPanelHeader/>
      <Switch>
        <Route path="/search/tab1" component={() => <div>tab1</div>}/>
        <Route path="/search/tab2" component={() => <div>tab2</div>}/>
        <Route path="/search/tab3" component={() => <div>tab3</div>}/>
      </Switch>
    </>
  );
}

