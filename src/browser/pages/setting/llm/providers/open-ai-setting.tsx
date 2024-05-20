import styled from 'styled-components'
import { debounceSettingChange2, useSettingStore } from '../../setting-store'
import React from 'react'
import { ThemedInput } from '../../../../components/themed-ui/input/input'
import {
  SettingEntry,
  SettingEntryControl,
  SettingEntryLabel,
} from '../../components'

const Container = styled.div`
  margin-top: 20px;
`

export const OpenAiSetting = () => {
  const llm = useSettingStore.use.llm()
  const baseUrl = llm.providers.open_ai?.base_url
  const apiKey = llm.providers.open_ai?.api_key
  const modelName = llm.providers.open_ai?.model_name
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
              debounceSettingChange2((state) => {
                state.llm.providers.open_ai = {
                  ...(state.llm.providers.open_ai ?? {}),
                  base_url: e.target.value ? e.target.value : null,
                }
              })
            }}
            spellCheck={false}
          />
        </SettingEntryControl>
      </SettingEntry>
      <SettingEntry>
        <SettingEntryLabel>API Key: </SettingEntryLabel>
        <SettingEntryControl>
          <ThemedInput
            value={apiKey ?? ''}
            onChange={(e) => {
              debounceSettingChange2((state) => {
                state.llm.providers.open_ai = {
                  ...(state.llm.providers.open_ai ?? {}),
                  api_key: e.target.value ? e.target.value : null,
                }
              })
            }}
            spellCheck={false}
          />
        </SettingEntryControl>
      </SettingEntry>
      <SettingEntry>
        <SettingEntryLabel>Model: </SettingEntryLabel>
        <SettingEntryControl>
          <ThemedInput
            value={modelName ?? ''}
            onChange={(e) => {
              debounceSettingChange2((state) => {
                state.llm.providers.open_ai = {
                  ...(state.llm.providers.open_ai ?? {}),
                  model_name: e.target.value ? e.target.value : null,
                }
              })
            }}
            spellCheck={false}
          />
        </SettingEntryControl>
      </SettingEntry>
    </Container>
  )
}
