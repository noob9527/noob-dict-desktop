import React from 'react';
import styled from 'styled-components';
import { ThemedSelect } from '../../components/themed-ui/selector/select';
import { TextareaActions, useTextareaStore } from './textarea-store';
import { LLMProvider } from '../../../common/services/llm/provider';
import changeProvider = TextareaActions.changeProvider;

const StyledSelect = styled(ThemedSelect)`
  min-width: 100px;
`

export const ModelSelect: React.FC = () => {
  const providers = useTextareaStore.use.availableLLMProviders()
    .map(e => LLMProvider.of(e))
  const selected = useTextareaStore.use.selectedLLMProvider()
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
