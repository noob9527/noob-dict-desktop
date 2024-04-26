import React, { useCallback } from 'react';
import SearchPanel from './panel/search-panel';
import SearchHeaderInput from './input/search-input';
import SearchToolBar from './tool-bar/search-tool-bar';
import EcDictBar from './ecdict/ecdict-bar';
import ColorId from '../../styles/ColorId';
import { SearchPanelState } from './panel/search-panel-model';
import { useDispatch, useSelector } from 'react-redux';
import { SearchPanelMenu, SearchPanelMenuItem } from './panel/search-panel-menu';
import { ThemedContent } from '../../components/themed-ui/content/content';
import styled from 'styled-components';
import SearchNote from './note/search-note';
import SearchPageSplitPane from './search-page-split-pane';
import { SearchState, SPLIT_PANE_SIZE_MAX, SPLIT_PANE_SIZE_MIN } from './search-model';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';
import { SearchResultType } from '@noob9527/noob-dict-core';
import { NetworkEngineId } from '@noob9527/noob-dict-net-engines';
import { TransientState } from '../transient-model';
import { useTransientStore } from '../transient-store';

const SearchPage = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  flex: 1;
  overflow: hidden;

  > #result-area {
    display: flex;
    flex-direction: column;
    //overflow: auto;  // default scroll bar, we use react-scrollbar instead
    flex: 1;
    overflow: hidden;
  }
`;


export default () => {
  const dispatch = useDispatch();
  const routerState = useSelector((state: any) => state.router);
  const searchState: SearchState = useSelector((state: any) => state.search);
  const searchPanelState: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const ecDictAvailable = useTransientStore.use.ecDictAvailable()

  const matched = /engine_view\/(\w+)/
    .exec(routerState.location.pathname);
  const engine: NetworkEngineId = ((matched && matched[1])
    ?? searchPanelState.primaryResult?.engine
    ?? NetworkEngineId.BING) as NetworkEngineId;

  const searchResult = searchPanelState.searchResultMap[engine];
  const showSearchNote =
    // in engine view
    routerState?.location?.pathname?.includes('engine_view')
    // has success result
    && searchResult!!
    && SearchResultType.isSuccessResult(searchResult!!);

  const handleUpdateSize = size => {
    dispatch({
      type: 'search/updatePanelSize',
      payload: {
        splitPaneSize: size,
      },
    });
  };
  const debounced = useCallback(debounce(handleUpdateSize, 200), []);

  const engineMenuItems = Object.keys(searchPanelState.searchResultMap)
    .filter(e => !!e)
    .map(e => (<SearchPanelMenuItem
        key={e}
        active={e===engine}
        to={`/search/engine_view/${e}`}
      >{e}</SearchPanelMenuItem>)
    );
  return (
    <SearchPage>
      <Header>
        <SearchHeaderInput/>
        <SearchToolBar/>
      </Header>
      <Content>
        <nav>
          <SearchPanelMenu>
            {/*<MenuItem to={'/search/overview'}>OVERVIEW</MenuItem>*/}
            {engineMenuItems}
            {/*{histories.length ? <MenuItem to={'/search/history'}></MenuItem> : null}*/}
            {/*<MenuItem to={'/search/tab1'}>tab1</MenuItem>*/}
            {/*<MenuItem to={'/search/tab2'}>tab2</MenuItem>*/}
          </SearchPanelMenu>
        </nav>
        <ThemedContent id={'result-area'}>
          {ecDictAvailable
            ? (<EcDictBar result={searchPanelState.ecDictSearchResult}/>)
            :null
          }
          {showSearchNote ?
            (
              <SearchPageSplitPane
                primary="second"
                split="horizontal"
                minSize={SPLIT_PANE_SIZE_MIN}
                maxSize={SPLIT_PANE_SIZE_MAX}
                defaultSize={60}
                size={searchState.splitPaneSize}
                onChange={debounced}
              >
                <SearchPanel/>
                <SearchNote/>
              </SearchPageSplitPane>
            )
            :
            (
              <SearchPanel/>
            )
          }
        </ThemedContent>
      </Content>
    </SearchPage>
  );
}
