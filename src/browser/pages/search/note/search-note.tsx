import React from 'react';
import ScrollArea from 'react-scrollbar';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'dva';
import { SearchNoteState } from './search-note-model';
import HistoryGraph from './history-graph';
import { SearchPanelState } from '../panel/search-panel-model';
import HistoryTable from './history-table';
import { Button, Icon } from "antd";
import { SearchState } from '../search-model';

const Title = styled.header`
  margin: 10px 0;
  text-align: center;
  line-height: 32.5px;
  h4 {
    margin: 0;
    display: inline-block;
    font-weight: bold;
  }
  span:nth-child(2) {
    margin-left: 5px;
    font-size: 0.8rem;
  }
  span:nth-child(3) {
    position: fixed;
    right: 10px;
  }
`;

const Container = styled.div`
    height: 100%;
    margin: 10px;
`;

const StyledScrollArea = styled(ScrollArea)`
  &.scrollarea {
    padding: 15px;
    height: 100%;
    .scrollbar {
      background-color: white !important;
    }
  }
`;

const SearchNote = () => {
  const dispatch = useDispatch();
  const searchState: SearchState = useSelector((state: any) => state.search);
  const panelState: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const noteState: SearchNoteState = useSelector((state: any) => state.searchNote);

  if (!panelState.translatedText) {
    return <div/>;
  }
  let { histories, noteInDb } = noteState;

  return (
    <Container>
      <Title>
        <h4>QUICK NOTES</h4>
        <span>{`(You've searched '${noteInDb?.text}' ${noteInDb?.updateTimes} times)`}</span>
        <span>
          <Button type="link" shape="circle" ghost onClick={() => {
            dispatch({
              type: 'search/togglePaneSize',
            });
          }}>
            <Icon type={searchState.splitPaneButtonUp ? 'up' : 'down'}/>
          </Button>
        </span>
      </Title>
      <StyledScrollArea>
        <HistoryTable histories={histories}/>
        {/*<HistoryGraph histories={histories}/>*/}
      </StyledScrollArea>
    </Container>
  );
};

export default SearchNote;
