import React from 'react';
import SearchPanel from './panel/search-panel';
import SearchHeaderInput from './input/search-input';
import SearchToolBar from './tool-bar/search-tool-bar';
import ColorId from '../../styles/ColorId';
import { SearchPanelState } from './panel/search-panel-model';
import { useSelector } from 'react-redux';
import { Menu, MenuItem } from './panel/search-panel-menu';
import { ThemedContent } from '../../components/themed-ui/content/content';
import { ThemedTextArea } from '../../components/themed-ui/input/textarea';
import styled from 'styled-components';
import SearchNote from './note/search-note';
import ThemedSplitPane from '../../components/themed-ui/split-pane/split-pane';

const SearchPage = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  > * + * {
    flex: 1;
    overflow: hidden;
  }
`;

const Header = styled.header`
  color: ${props => props.theme[ColorId.foreground]};
  background-color: ${props => props.theme[ColorId.background]};
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;

  > * + * {
    display: flex;
    flex-direction: column;
    //overflow: auto;  // default scroll bar, we use react-scrollbar instead
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
    <SearchPage>
      <Header>
        <SearchHeaderInput/>
        <SearchToolBar/>
      </Header>
      <Content>
        <nav>
          <Menu>
            <MenuItem to={'/search/overview'}>OVERVIEW</MenuItem>
            {engineMenuItems}
            {/*{histories.length ? <MenuItem to={'/search/history'}></MenuItem> : null}*/}
            {/*<MenuItem to={'/search/tab1'}>tab1</MenuItem>*/}
            {/*<MenuItem to={'/search/tab2'}>tab2</MenuItem>*/}
          </Menu>
        </nav>
        <ThemedContent>
          <ThemedSplitPane
            primary="second"
            split="horizontal"
            minSize={60}
            defaultSize={60}
            maxSize={400}
          >
            <SearchPanel/>
            <SearchNote/>
          </ThemedSplitPane>
        </ThemedContent>
      </Content>

      {/*<SearchPanelLegacy/>*/}
    </SearchPage>
  );
}