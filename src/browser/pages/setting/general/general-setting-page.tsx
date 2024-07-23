import { debounceSettingChange, useSettingStore } from '../setting-store'
import { shell } from 'electron'
import { DbLocationSetting } from './db-location-setting'
import { EcdictLocationSetting } from './ecdict-location-setting'
import { ThemedCheckbox } from '../../../components/themed-ui/input/checkbox'
import { ThemedInputShortcut } from '../../../components/themed-ui/input/input-shortcut/themed-input-shortcut'
import React from 'react'
import { rendererContainer } from '../../../../common/container/renderer-container'
import {
  AppService,
  AppServiceToken,
} from '../../../../common/services/app-service'
import styled from 'styled-components'

const appService = rendererContainer.get<AppService>(AppServiceToken)
const userDataFolder = appService.getUserDataFolder()

const Container = styled.div`
  > div {
    margin: 30px 0;
  }
`

const InlineContainer = styled.span`
  display: inline-flex;
  align-items: center;

  > * + * {
    margin-left: 10px;
  }
`

export const GeneralSettingPage = () => {
  const { appHotKey, readClipboard } = useSettingStore()
  return (
    <Container>
      <div>
        <span>User Data Folder: </span>
        <a
          onClick={() => {
            shell.showItemInFolder(userDataFolder)
          }}
          role="button"
        >
          {userDataFolder}
        </a>
      </div>
      <DbLocationSetting />
      <EcdictLocationSetting />
      <div>
        <ThemedCheckbox
          checked={readClipboard}
          onChange={(event) => {
            debounceSettingChange({
              readClipboard: event?.target?.checked!!,
            })
          }}
        >
          Read Clipboard
        </ThemedCheckbox>
      </div>
      <div>
        <InlineContainer>
          <span>hot key:</span>
          <ThemedInputShortcut
            value={appHotKey}
            onChange={(value) => {
              debounceSettingChange({
                appHotKey: value,
              })
            }}
          />
        </InlineContainer>
      </div>
    </Container>
  )
}
