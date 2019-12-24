import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedCheckbox } from '../../components/checkbox/checkbox';
import { SettingState } from './setting-model';
import { ThemedContent } from '../../components/content/content';
import { ThemedInputShortcut } from '../../components/input-shortcut/themed-input-shortcut';

const Container = styled.div`
  height: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const InlineContainer = styled.span`
  display: inline-flex;
  align-items: center;
  > * + * {
    margin-left: 10px;
  }
`;

const SettingPage = () => {
  const dispatch = useDispatch();
  const settingState: SettingState = useSelector((state: any) => state.setting);
  const { appHotKey, watchClipboard, watchSelection } = settingState;

  return (
    <ThemedContent>
      <Container>
        <ThemedCheckbox
          checked={watchSelection}
          onChange={event => {
            dispatch({
              type: 'setting/mergeState',
              payload: {
                watchSelection: event?.target?.checked!!,
              },
            });
          }}>
          watch selection (only on linux)</ThemedCheckbox>
        <ThemedCheckbox
          checked={watchClipboard}
          onChange={event => {
            dispatch({
              type: 'setting/mergeState',
              payload: {
                watchClipboard: event?.target?.checked!!,
              },
            });
          }}>
          watch clipboard</ThemedCheckbox>
        <InlineContainer>
          <span>hot key:</span>
          <ThemedInputShortcut
            value={appHotKey}
            onChange={value => {
              dispatch({
                type: 'setting/mergeState',
                payload: {
                  appHotKey: value,
                },
              });
            }}
          />
        </InlineContainer>
      </Container>
    </ThemedContent>
  );
};

export default SettingPage;