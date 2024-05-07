import { Language } from '../../../common/utils/lan-detector';
import React from 'react';
import styled from 'styled-components';
import { ThemedSelect } from '../../components/themed-ui/selector/select';
import { useTextareaStore } from './textarea-store';

const StyledSelect = styled(ThemedSelect)`
  width: 200px;
`

const options = [
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: 'Chinese' },
  { value: 'JP', label: 'Japanese' },
  { value: 'DEFAULT', label: 'Detect Language' },
]

export const LanguageSelect: React.FC = () => {
  const detectedRawLanguage = useTextareaStore.use.detectedRawLanguage()
  const rawLanguage = useTextareaStore.use.rawLanguage()

  const displayLanguage = rawLanguage ?? detectedRawLanguage ?? 'DEFAULT'
  const isAutoDetected = !rawLanguage && detectedRawLanguage

  return (
    <StyledSelect
      size={'small'}
      placeholder="Source Language"
      value={displayLanguage}
      optionLabelProp="label"
      onChange={(value) => {
        if (value == 'DEFAULT') {
          useTextareaStore.setState({
            rawLanguage: null,
          })
        } else {
          useTextareaStore.setState({
            rawLanguage: (value ?? null) as Language | null,
          })
        }
      }}
    >
      {options.map((e) => {
        return (
          <StyledSelect.Option
            key={e.value}
            label={e.label + (isAutoDetected ? '(Detected)' : '')}
          >
            {e.label}
          </StyledSelect.Option>
        )
      })}
    </StyledSelect>
  )
}
