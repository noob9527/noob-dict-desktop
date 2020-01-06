import React from 'react';
import ScrollArea from 'react-scrollbar';
import styled from 'styled-components';
import { useSelector } from 'dva';
import { SearchNoteState } from './search-note-model';
import HistoryGraph from './history-graph';
import { SearchPanelState } from '../panel/search-panel-model';
import { ThemedTextArea } from '../../../components/themed-ui/input/textarea';
import moment from 'moment';
import HistoryTable from './history-table';

const Title = styled.h4`
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
`;

const Container = styled.div`
    height: 100%;
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
  const panelState: SearchPanelState = useSelector((state: any) => state.searchPanel);
  const noteState: SearchNoteState = useSelector((state: any) => state.searchNote);

  if (!panelState.translatedText) {
    return <div/>;
  }
  let { histories } = noteState;

  return (
    <Container>
      <Title>QUICK NOTES</Title>
      <StyledScrollArea>
        <HistoryTable histories={histories}/>
        {/*{histories.map((e, i) => (*/}
        {/*  <div key={i}>*/}
        {/*    <span>{moment(e.createAt).format('YYYY-MM-DD HH:mm:ss')}</span>*/}
        {/*    <span>{e.context}</span>*/}
        {/*  </div>*/}
        {/*))}*/}
        <ThemedTextArea
          placeholder={`give me more context about '${panelState.translatedText}' to improve your memory`}
          autoSize={{ minRow: 1 }}
        />
        {histories.length ? <HistoryGraph histories={histories}/> : null}
      </StyledScrollArea>
    </Container>
  );
};

export default SearchNote;
