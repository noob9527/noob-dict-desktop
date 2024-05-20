import styled from 'styled-components'
import { debounceSettingChange2, useSettingStore } from '../../setting-store'
import React from 'react'
import { ThemedInput } from '../../../../components/themed-ui/input/input'
import {
  SettingEntry,
  SettingEntryControl,
  SettingEntryLabel,
} from '../../components'

const Container = styled.div``

export const OllamaSetting = () => {
  const llm = useSettingStore.use.llm()
  const baseUrl = llm.providers.ollama?.base_url
  const modelName = llm.providers.ollama?.model_name
  return (
    <Container>
      <h1>Ollama</h1>
      <SettingEntry>
        <SettingEntryLabel>Base URL: </SettingEntryLabel>
        <SettingEntryControl>
          <ThemedInput
            value={baseUrl ?? ''}
            onChange={(e) => {
              debounceSettingChange2((state) => {
                state.llm.providers.ollama = {
                  ...(state.llm.providers.ollama ?? {}),
                  base_url: e.target.value ? e.target.value : null,
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
                state.llm.providers.ollama = {
                  ...(state.llm.providers.ollama ?? {}),
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
