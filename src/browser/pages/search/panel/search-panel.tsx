import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SearchPanelState } from './search-panel-model';
import { useSelector } from 'react-redux';
import OverviewView from '../views/overview/OverviewView';
import EngineView from '../views/engine/engine-view';
import { Menu, MenuItem } from './search-panel-menu';
import { ThemedContent } from '../../../components/content/content';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  
  > * + * {
    overflow: hidden;
    flex: 1;
  }
`;

export default () => {
  const state: SearchPanelState = useSelector((state: any) => state.searchPanel);

  const engineMenuItems = Object.keys(state.searchResults)
    .filter(e => !!e)
    .map(e => <MenuItem key={e} to={`/search/engine_view/${e}`}>{e}</MenuItem>);

  return (
    <Container>
      <nav>
        <Menu>
          {/*<MenuItem to={"/search/overview"}>OVERVIEW</MenuItem>*/}
          {engineMenuItems}
          <MenuItem to={'/search/tab1'}>tab1</MenuItem>
          <MenuItem to={'/search/tab2'}>tab2</MenuItem>
        </Menu>
      </nav>
      <ThemedContent className={'content'}>
        <Switch>
          <Route path="/search/tab1" component={() => <div>tab1</div>}/>
          <Route path="/search/tab2" component={() => <div>tab2</div>}/>
          <Route path="/search/engine_view/:engine" component={EngineView}/>
          <Route path="/search/overview" component={OverviewView}/>
          <Route component={OverviewView}/>
        </Switch>
      </ThemedContent>
    </Container>
  );
}

