import React from 'react'
import styled from 'styled-components'
import { ThemedContent } from '../../../components/themed-ui/content/content'
import Markdown from 'react-markdown'
import { ThemedScrollArea } from '../../../components/themed-ui/content/scroll-area';
import { FooterToolBar } from '../footer-tool-bar';
import { useTextareaStore } from '../textarea-store';

const Container = styled(ThemedContent)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  font-size: 1.5rem;
`

const StyledScrollArea = styled(ThemedScrollArea)`
  padding: 4px 11px;
`

const Footer = styled.div``

export const TranslatePage: React.FC = () => {
  const translated = useTextareaStore.use.translatedText()
  return (
    <Container>
      <StyledScrollArea>
        <Markdown>{translated}</Markdown>
      </StyledScrollArea>
      {/*<FooterToolBar>*/}
      {/*  <Footer></Footer>*/}
      {/*</FooterToolBar>*/}
    </Container>
  )
}
