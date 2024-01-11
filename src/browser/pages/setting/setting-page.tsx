import React, { useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedCheckbox } from '../../components/themed-ui/input/checkbox';
import { ThemedContent } from '../../components/themed-ui/content/content';
import { ThemedInputShortcut } from '../../components/themed-ui/input/input-shortcut/themed-input-shortcut';
import { EcdictLocationSetting } from './ecdict-location-setting';
import { rendererContainer } from '../../../common/container/renderer-container';
import { shell } from 'electron';
import { AppService, AppServiceToken } from '../../../common/services/app-service';
import { DbLocationSetting } from './db-location-setting';
import { settingChange, useSettingStore } from './setting-store';
const appService = rendererContainer.get<AppService>(AppServiceToken);

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

const userDataFolder = appService.getUserDataFolder();

const SettingPage = () => {
  const {
    appHotKey,
    readClipboard,
    watchSelection ,
  } = useSettingStore()

  return (
    <ThemedContent>
      <Container>
        <div>
          <span>User Data Folder: </span>
          <a
            onClick={() => {
              shell.showItemInFolder(userDataFolder);
            }}
            role="button"
          >{userDataFolder}</a>
        </div>
        <DbLocationSetting/>
        <EcdictLocationSetting/>
        <ThemedCheckbox
          checked={watchSelection}
          onChange={event => {
            settingChange({
              watchSelection: event?.target?.checked!!,
            })
          }}>Watch Selection (Only on Linux)</ThemedCheckbox>
        <ThemedCheckbox
          checked={readClipboard}
          onChange={event => {
            settingChange({
              readClipboard: event?.target?.checked!!,
            })
          }}>Read Clipboard</ThemedCheckbox>
        <InlineContainer>
          <span>hot key:</span>
          <ThemedInputShortcut
            value={appHotKey}
            onChange={value => {
              settingChange({
                appHotKey: value,
              })
            }}
          />
        </InlineContainer>
      </Container>
    </ThemedContent>
  );
};

export default SettingPage;
