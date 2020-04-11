import React from 'react';
import styled from 'styled-components';
import { ThemedContent } from '../../components/themed-ui/content/content';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../root-model';
import { ThemedButton } from '../../components/themed-ui/button/button';
import { rendererContainer } from '../../../common/container/renderer-container';
import { GlobalHistoryService, GlobalHistoryServiceToken } from '../../../common/services/global-history-service';

const Container = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  
  p:nth-child(1) {
    button + button {
      margin-left: 10px;
    }
  }
`;

const globalHistoryService = rendererContainer.get<GlobalHistoryService>(GlobalHistoryServiceToken);

const DeveloperPage = () => {
  const rootState: RootState = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  return (
    <ThemedContent>
      <Container>
        <p>
          <span>last sync time:</span>
          <span>{rootState.currentUser?.last_sync_time}</span>

          <ThemedButton
            onClick={() => {
              globalHistoryService.syncHistories();
            }}
          >sync</ThemedButton>

          <ThemedButton
            onClick={() => {
              dispatch({
                type: 'developer/resetLastSyncTime',
              })
            }}
          >reset last sync time</ThemedButton>
        </p>
      </Container>
    </ThemedContent>
  )
};

export default DeveloperPage;
