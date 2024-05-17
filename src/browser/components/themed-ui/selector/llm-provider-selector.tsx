import React from 'react'
import { LLMProvider } from '../../../../common/services/llm/provider'
import { ThemedSelect } from './select'

export interface LLMProviderSelectorProps {
  value: LLMProvider.Constant | null
  availableProviders: LLMProvider.Constant[]
  onSelect?: (provider: LLMProvider.Constant) => void
  className?: string
}

export const LLMProviderSelector: React.FC<LLMProviderSelectorProps> = (
  props: LLMProviderSelectorProps,
) => {
  const { onSelect, value, availableProviders } = props
  const providers = availableProviders.map((e) => LLMProvider.of(e))

  return (
    <ThemedSelect
      className={props.className}
      size={'small'}
      placeholder="Service Provider"
      value={value}
      optionLabelProp="label"
      onChange={(value) => {
        onSelect?.(value as LLMProvider.Constant)
      }}
    >
      {providers.map((e) => {
        return (
          <ThemedSelect.Option key={e.name} label={e.label}>
            {e.label}
          </ThemedSelect.Option>
        )
      })}
    </ThemedSelect>
  )
}
