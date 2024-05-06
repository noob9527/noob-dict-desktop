import React from 'react'
import { TranslateActions, useTranslateStore } from './translate-store'
import styled from 'styled-components'
import { ThemedTextArea2 } from '../../../components/themed-ui/input/textarea2'
import { FooterToolBar } from '../footer-tool-bar'
import { LeftContainer } from '../left-container'
import changeRawText = TranslateActions.changeRawText
import { LanguageSelect } from '../language-selector';

const RawTextArea = styled(ThemedTextArea2)`
  font-size: 1.5rem;
  width: 100%;
  flex-grow: 1;
  //min-height: 100%;
  resize: none;
`

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`

export const LeftPane: React.FC = () => {
  const raw = useTranslateStore.use.raw()

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
        <Footer>
          <LanguageSelect />
        </Footer>
      </FooterToolBar>
    </LeftContainer>
  )
}
