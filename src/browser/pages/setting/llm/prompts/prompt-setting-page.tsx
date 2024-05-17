import React from 'react'
import styled from 'styled-components'
import { ThemedTextArea } from '../../../../components/themed-ui/input/textarea'
import { ThemedScrollArea } from '../../../../components/themed-ui/content/scroll-area';

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  //margin: 30px 0;
`

const StyledScrollArea = styled(ThemedScrollArea)`
  padding-right: 40px;
`

const StyledTextArea = styled(ThemedTextArea)`
`

export const PromptSettingPage = () => {
  return <Container>
    <StyledScrollArea>
      <h1>Quiz Generation Prompt</h1>
      <StyledTextArea />
    </StyledScrollArea>
  </Container>
}
