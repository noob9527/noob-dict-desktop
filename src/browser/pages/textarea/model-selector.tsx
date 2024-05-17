import React, { useEffect } from 'react'
import styled from 'styled-components'
import { TextareaActions, useTextareaStore } from './textarea-store'
import { useSettingStore } from '../setting/setting-store'
import { LLMProviderSelector } from '../../components/themed-ui/selector/llm-provider-selector'
import changeProvider = TextareaActions.changeProvider

const StyledSelect = styled(LLMProviderSelector)`
  min-width: 100px;
`

export const ModelSelect: React.FC = () => {
  const availableLLMProviders = useSettingStore.use.availableLLMProviders()
  const selected = useTextareaStore.use.selectedLLMProvider()

  useEffect(() => {
    // select 1 provider if we've got any available providers
    if (availableLLMProviders.length) {
      changeProvider(availableLLMProviders[0], false)
    }
  }, [availableLLMProviders])

  return (
    <StyledSelect
      availableProviders={availableLLMProviders}
      onSelect={(provider) => changeProvider(provider, true)}
      value={selected}
    />
  )
}
