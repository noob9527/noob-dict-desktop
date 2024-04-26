import React from 'react'
import { useTranslateStore } from './translate-store'
import styled from 'styled-components'
import Markdown from 'react-markdown'
import { ThemedScrollArea } from '../../../components/themed-ui/content/scroll-area'
import { FooterToolBar } from '../footer-tool-bar'
import { RightContainer } from '../right-container'

const StyledScrollArea = styled(ThemedScrollArea)`
  padding: 4px 11px;
`

const Footer = styled.div`
`

export const RightPane: React.FC = () => {
  const translated = useTranslateStore.use.translatedText()
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
