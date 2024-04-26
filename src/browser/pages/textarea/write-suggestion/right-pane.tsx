import React from 'react'
import styled from 'styled-components'
import Markdown from 'react-markdown'
import { ThemedScrollArea } from '../../../components/themed-ui/content/scroll-area'
import { FooterToolBar } from '../footer-tool-bar'
import { RightContainer } from '../right-container'
import { useWriteSuggestionStore } from './write-suggestion-store';

const StyledScrollArea = styled(ThemedScrollArea)`
  padding: 4px 11px;
`

const Footer = styled.div`
`

export const RightPane: React.FC = () => {
  const translated = useWriteSuggestionStore.use.generatedText()
  return (
    <RightContainer>
      <StyledScrollArea>
        <Markdown>{translated}</Markdown>
      </StyledScrollArea>
      <FooterToolBar>
        <Footer></Footer>
      </FooterToolBar>
    </RightContainer>
  )
}
