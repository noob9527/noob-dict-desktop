import React from 'react'
import styled from 'styled-components'
import { OpenAiSetting } from './open-ai-setting'
import { GeminiSetting } from './gemini-setting'
import { OllamaSetting } from './ollama-setting'
import { ThemedScrollArea } from '../../../../components/themed-ui/content/scroll-area'

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  //margin: 30px 0;
`

// @ts-ignore
const StyledScrollArea = styled(ThemedScrollArea)`
  padding-right: 40px;
`

export const LLMProviderSettingPage = () => {
  return (
    <Container>
      <StyledScrollArea>
        <OpenAiSetting />
        <GeminiSetting />
        <OllamaSetting />
      </StyledScrollArea>
    </Container>
  )
}
