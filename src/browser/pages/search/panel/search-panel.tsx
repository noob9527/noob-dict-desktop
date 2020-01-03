import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ScrollArea from 'react-scrollbar';
import OverviewView from '../views/overview/OverviewView';
import EngineView from '../views/engine/engine-view';
import styled from 'styled-components';

const Container = styled(ScrollArea)`
  &.scrollarea {
    padding: 15px;
    height: 100%;
    .scrollbar {
      background-color: white !important;
    }
  }
`;

export default () => {
  return (
    <Container>
      <Switch>
        {/*<Route path="/search/tab1" component={() => <div>tab1</div>}/>*/}
        {/*<Route path="/search/tab2" component={() => <div>tab2</div>}/>*/}
        <Route path="/search/overview" component={OverviewView}/>
        <Route path="/search/engine_view/:engine" component={EngineView}/>
        <Route component={OverviewView}/>
      </Switch>
    </Container>
  );
}

