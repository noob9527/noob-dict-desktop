import React, { useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedCheckbox } from '../../components/themed-ui/input/checkbox';
import { ThemedContent } from '../../components/themed-ui/content/content';
import { ThemedInputShortcut } from '../../components/themed-ui/input/input-shortcut/themed-input-shortcut';
import { UserProfile } from '../../../common/model/user-profile';
import { EcdictLocationSetting } from './ecdict-location-setting';

const Container = styled.div`
  height: 100vh;
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
  const settingState: UserProfile = useSelector((state: any) => state.setting);
  const { appHotKey, readClipboard, watchSelection } = settingState;

  return (
    <ThemedContent>
      <Container>
        <EcdictLocationSetting/>
        <ThemedCheckbox
          checked={watchSelection}
          onChange={event => {
            dispatch({
              type: 'setting/settingChange',
              payload: {
                watchSelection: event?.target?.checked!!,
              },
            });
          }}>Watch Selection (Only on Linux)</ThemedCheckbox>
        <ThemedCheckbox
          checked={readClipboard}
          onChange={event => {
            dispatch({
              type: 'setting/settingChange',
              payload: {
                readClipboard: event?.target?.checked!!,
              },
            });
          }}>Read Clipboard</ThemedCheckbox>
        <InlineContainer>
          <span>hot key:</span>
          <ThemedInputShortcut
            value={appHotKey}
            onChange={value => {
              dispatch({
                type: 'setting/settingChange',
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
