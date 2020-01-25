import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ScrollArea from 'react-scrollbar';
import OverviewView from '../views/overview/overview-view';
import EngineView from '../views/engine/engine-view';
import styled from 'styled-components';

const Container = styled(ScrollArea)`
  &.scrollarea {
    padding: 15px;
    height: 100%;
    .scrollbar {
      background-color: white !important;
    }
    // make the content height fill the container
    // https://stackoverflow.com/questions/1122381/how-to-force-child-div-to-be-100-of-parent-divs-height-without-specifying-pare
    .scrollarea-content {
      min-height: 100%;
      display: flex;
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

