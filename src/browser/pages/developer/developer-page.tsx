import React from 'react';
import styled from 'styled-components';
import { ThemedContent } from '../../components/themed-ui/content/content';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../root-model';
import { ThemedButton } from '../../components/themed-ui/button/button';
import { ThemedInput } from '../../components/themed-ui/input/input';
import { DeveloperState } from './developer-model';

const Container = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  button + button {
    margin-left: 10px;
  }
`;

const DeveloperPage = () => {
  const rootState: RootState = useSelector((state: any) => state.root);
  const developerState: DeveloperState = useSelector((state: any) => state.developer);
  const dispatch = useDispatch();

  let lastSyncTime: Date | null;
  if (rootState.currentUser?.last_sync_time==null) {
    lastSyncTime = null;
  } else {
    lastSyncTime = new Date(rootState.currentUser.last_sync_time);
  }
  const lastEvaluatedUpdateAt = rootState.lastEvaluatedUpdateAt;

  return (
    <ThemedContent>
      <Container>
        <p>
          <span>last sync time:</span>
          <span>{lastSyncTime?.toLocaleString()}</span>
        </p>
        <p>
          <span>last evaluated:</span>
          <span>{lastEvaluatedUpdateAt?.toLocaleString()}</span>
        </p>
        <p>
          <span>sync history page size</span>
          <ThemedInput
            value={developerState.syncHistoryPageSize}
            type='number'
            onChange={(e) => {
              dispatch({
                type: 'developer/mergeState',
                payload: {
                  syncHistoryPageSize: e.target.value,
                },
              });
            }}
          />
        </p>
        <p>
          <span>sync history page limit</span>
          <ThemedInput
            value={developerState.syncHistoryPageLimit}
            type='number'
            onChange={(e) => {
              dispatch({
                type: 'developer/mergeState',
                payload: {
                  syncHistoryPageLimit: e.target.value,
                },
              });
            }}
          />
        </p>

        <div>
          <ThemedButton
            onClick={() => {
              dispatch({
                type: 'search/syncHistoryPages',
                payload: {
                  pageSize: developerState.syncHistoryPageSize,
                  pageLimit: developerState.syncHistoryPageLimit,
                }
              });
            }}
          >Sync Histories</ThemedButton>

          <ThemedButton
            onClick={() => {
              dispatch({
                type: 'developer/resetSyncFlag',
              });
            }}
          >Reset Sync Flag</ThemedButton>

          <ThemedButton
            onClick={() => {
              dispatch({
                type: 'developer/migrateLocalDB',
              });
            }}
          >Migrate Local DB</ThemedButton>
        </div>

      </Container>
    </ThemedContent>
  );
};

export default DeveloperPage;
