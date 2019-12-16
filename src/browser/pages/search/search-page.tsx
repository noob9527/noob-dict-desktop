import React from 'react';
import SearchPanel from "./panel/search-panel";
import SearchPanelLegacy from "./panel/search-panel-legacy";
import SearchHeaderInput from "./input/search-input";
import SearchToolBar from "./tool-bar/SearchToolBar";
import styled from 'styled-components';
import ColorId from '../../styles/ColorId';

const SearchPage = styled.div`
  height: 100vh;
`;

const Header = styled.header`
  color: ${props => props.theme[ColorId.foreground]};
  background-color: ${props => props.theme[ColorId.background]};
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default () => {
  return (
    <SearchPage>
      <Header>
        <SearchHeaderInput/>
        <SearchToolBar/>
      </Header>
      <SearchPanel/>
      {/*<SearchPanelLegacy/>*/}
    </SearchPage>
  );
}