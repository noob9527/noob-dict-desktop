import styled from 'styled-components'
import { settingChange, useSettingStore } from '../setting-store'
import React from 'react'
import { ThemedInput } from '../../../components/themed-ui/input/input'
import {
  SettingEntry,
  SettingEntryControl,
  SettingEntryLabel,
} from '../components'

const Container = styled.div``

export const OpenAiSetting = () => {
  const llm = useSettingStore.use.llm()
  const baseUrl = llm.open_ai?.base_url
  const apiKey = llm.open_ai?.api_key
  return (
    <Container>
      <h1>Open AI</h1>
      {/*<span className="status-icon">*/}
      {/*{*/}
      {/*  openaiApiAvailable*/}
      {/*    ? (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>)*/}
      {/*    :(<Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96"/>)*/}
      {/*}*/}
      {/*</span>*/}
      <SettingEntry>
        <SettingEntryLabel>Base URL: </SettingEntryLabel>
        <SettingEntryControl>
          <ThemedInput
            value={baseUrl ?? ''}
            onChange={(e) => {
              settingChange({
                llm: {
                  ...llm,
                  open_ai: {
                    ...(llm?.open_ai ?? {}),
                    base_url: e.target.value ? e.target.value : null,
                  }
                },
              })
            }}
          />
        </SettingEntryControl>
      </SettingEntry>
      <SettingEntry>
        <SettingEntryLabel>API Key: </SettingEntryLabel>
        <SettingEntryControl>
          <ThemedInput
            value={apiKey ?? ''}
            onChange={(e) => {
              settingChange({
                llm: {
                  ...llm,
                  open_ai: {
                    ...(llm?.open_ai ?? {}),
                    api_key: e.target.value ? e.target.value : null,
                  }
                },
              })
            }}
          />
        </SettingEntryControl>
      </SettingEntry>
    </Container>
  )
}
