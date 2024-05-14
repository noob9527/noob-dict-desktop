import React from 'react'
import { useQuizStore } from './quiz-store'
import styled from 'styled-components'

const Container = styled.div``

export const QuizPage: React.FC = () => {
  const state = useQuizStore()
  return <Container></Container>
}
