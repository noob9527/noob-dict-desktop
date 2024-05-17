import React, { useEffect } from 'react';
import styled from 'styled-components'
import { ThemedSelect } from '../../components/themed-ui/selector/select'
import { TextareaActions, useTextareaStore } from './textarea-store';
import { LLMProvider } from '../../../common/services/llm/provider'
import { useSettingStore } from '../setting/setting-store'
import changeProvider = TextareaActions.changeProvider

const StyledSelect = styled(ThemedSelect)`
  min-width: 100px;
`

export const ModelSelect: React.FC = () => {
  const providers = useSettingStore.use.availableLLMProviders()
    .map(e => LLMProvider.of(e))
  const selected = useTextareaStore.use.selectedLLMProvider()

  useEffect(() => {
    // select 1 provider if we've got any available providers
    if (providers.length) {
      changeProvider(providers[0].name as LLMProvider.Constant)
    }
  }, providers)

  return (
    <StyledSelect
      size={'small'}
      placeholder="Service Provider"
      value={selected}
      optionLabelProp="label"
      onChange={(value) => {
        changeProvider(value as LLMProvider.Constant)
      }}
    >
      {providers.map((e) => {
        return (
          <StyledSelect.Option
            key={e.name}
            label={e.label}
          >
            {e.label}
          </StyledSelect.Option>
        )
      })}
    </StyledSelect>
  )
}
