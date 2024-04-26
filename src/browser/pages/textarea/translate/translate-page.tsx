import React from 'react'
import styled from 'styled-components'
import { ThemedContent } from '../../../components/themed-ui/content/content'
import { LeftPane } from './left-pane'
import { RightPane } from './right-pane'

const Container = styled(ThemedContent)`
  height: 100vh;
  display: flex;
  padding: 10px;
`

export const TranslatePage: React.FC = () => {
  return (
    <Container>
      <LeftPane />
      <RightPane />
    </Container>
  )
}
