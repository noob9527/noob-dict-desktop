import React from 'react'
import styled from 'styled-components'
import { ThemedTextArea2 } from '../../../components/themed-ui/input/textarea2'
import { FooterToolBar } from '../footer-tool-bar'
import { LeftContainer } from '../left-container'
import { useWriteSuggestionStore, WriteSuggestionActions } from './write-suggestion-store';
import changeRawText = WriteSuggestionActions.changeRawText;

const RawTextArea = styled(ThemedTextArea2)`
  font-size: 1.5rem;
  width: 100%;
  flex-grow: 1;
  //min-height: 100%;
  resize: none;
`

const Footer = styled.div`
`

export const LeftPane: React.FC = () => {
  const raw = useWriteSuggestionStore.use.raw()

  return (
    <LeftContainer>
      <RawTextArea
        value={raw}
        readOnly={false}
        onChange={(e) => {
          changeRawText(e.target.value)
        }}
        spellCheck={false}
      />
      <FooterToolBar>
        <Footer />
      </FooterToolBar>
    </LeftContainer>
  )
}
