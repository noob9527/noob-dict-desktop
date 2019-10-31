import React from 'react';
import SearchPanel from "./panel/search-panel.component";
import SearchHeaderInput from "./input/search-input.component";
import SearchToolBar from "./tool-bar/SearchToolBar";
import styled from 'styled-components';

const SearchPage = styled.div`
  height: 100vh;
`;

const Header = styled.header`
  color: ${props => props.theme.foreground};
  background-color: ${props => props.theme.background};
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
    </SearchPage>
  );
}