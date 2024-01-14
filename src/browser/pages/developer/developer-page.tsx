import React from 'react'
import styled from 'styled-components'
import { ThemedContent } from '../../components/themed-ui/content/content'

const Container = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const DeveloperPage = () => {
  return (
    <ThemedContent>
      <Container></Container>
    </ThemedContent>
  )
}

export default DeveloperPage
