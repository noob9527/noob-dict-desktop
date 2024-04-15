import { settingChange, useSettingStore } from '../setting-store'
import React from 'react'
import styled from 'styled-components'
import { ThemedCheckbox } from '../../../components/themed-ui/input/checkbox'
import { OpenAiSetting } from './open-ai-setting';
import { GeminiSetting } from './gemini-setting';

const Container = styled.div`
  > div {
    margin: 30px 0;
  }
`

export const LLMSettingPage = () => {
  return <Container>
    <OpenAiSetting />
    <GeminiSetting />
  </Container>
}
