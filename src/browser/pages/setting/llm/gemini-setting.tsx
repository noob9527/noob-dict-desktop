import styled from 'styled-components'
import { Icon } from 'antd'
import { ThemedButton } from '../../../components/themed-ui/button/button'
import { settingChange, useSettingStore } from '../setting-store'
import React from 'react'
import { ThemedInput } from '../../../components/themed-ui/input/input'
import { SettingEntry, SettingEntryControl, SettingEntryLabel } from '../components';

const Container = styled.div``


export const GeminiSetting = () => {
  const llm = useSettingStore.use.llm()
  return (
    <Container>
      <h1>Gemini</h1>
      {/*<span className="status-icon">*/}
      {/*{*/}
      {/*  openaiApiAvailable*/}
      {/*    ? (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>)*/}
      {/*    :(<Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96"/>)*/}
      {/*}*/}
      {/*</span>*/}
      <SettingEntry>
        <SettingEntryLabel>API Key: </SettingEntryLabel>
        <SettingEntryControl>
          <ThemedInput
            value={llm?.gemini?.api_key ?? ''}
            onChange={(e) => {
              settingChange({
                llm: {
                  ...llm,
                  gemini: {
                    ...(llm?.gemini ?? {}),
                    api_key: e.target.value ? e.target.value : null,
                  }
                },
              })
            }}
            spellCheck={false}
          />
        </SettingEntryControl>
      </SettingEntry>
    </Container>
  )
}
