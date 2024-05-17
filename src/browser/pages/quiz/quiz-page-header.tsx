import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSettingStore } from '../setting/setting-store'
import { LLMProviderSelector } from '../../components/themed-ui/selector/llm-provider-selector'
import { QuizActions, useQuizStore } from './quiz-store'
import { Icon } from 'antd'
import generateQuestions = QuizActions.generateQuestions

const Container = styled.header`
  height: 52px;
  padding: 10px 0;
  display: flex;
  justify-content: end;
  align-items: center;
`

const StyledSelect = styled(LLMProviderSelector)`
  min-width: 100px;
  display: inline-block;
  margin-left: 10px;
`

const Span = styled.span`
  margin-left: 10px;
`

export const QuizPageHeader: React.FC = () => {
  const availableLLMProviders = useSettingStore.use.availableLLMProviders()
  const questionContainers = useQuizStore.use.questionContainers()
  const selected = useQuizStore.use.selectedLLMProvider()
  const generating = useQuizStore.use.generating()

  useEffect(() => {
    // select 1 provider if we've got any available providers
    if (availableLLMProviders.length) {
      useQuizStore.setState({
        selectedLLMProvider: availableLLMProviders[0],
      })
    }
    if (!questionContainers.length) {
      generateQuestions(2)
    }
  }, [availableLLMProviders, questionContainers])

  return (
    <Container>
      <span>Powered by</span>
      <StyledSelect
        availableProviders={availableLLMProviders}
        onSelect={(provider) => {
          useQuizStore.setState({
            selectedLLMProvider: provider,
          })
        }}
        value={selected}
      />
      <Span style={{ visibility: generating ? 'inherit' : 'hidden' }}>
        <Icon type="loading" spin={true} />
      </Span>
    </Container>
  )
}
