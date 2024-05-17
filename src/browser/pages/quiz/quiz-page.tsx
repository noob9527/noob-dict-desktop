import React from 'react'
import { QuizActions, useQuizStore } from './quiz-store'
import styled from 'styled-components'
import { ThemedContent } from '../../components/themed-ui/content/content'
import { ThemedButton } from '../../components/themed-ui/button/button'
import { SingleChoice } from './single-choice'
import previousQuestion = QuizActions.previousQuestion
import nextQuestion = QuizActions.nextQuestion

const Container = styled(ThemedContent)`
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Content = styled.div`
  flex-grow: 1;
  margin-bottom: 20px;
`

const Footer = styled.footer`
  height: 32px;
  display: flex;
  justify-content: center;
`

const StyledButton = styled(ThemedButton)`
  min-width: 80px;

  & + & {
    margin-left: 20px;
  }
`

export const QuizPage: React.FC = () => {
  const questionContainers = useQuizStore.use.questionContainers()
  const currentIndex = useQuizStore.use.currentIndex()
  const { question, selectedIndex } = questionContainers[currentIndex]

  return (
    <Container>
      <Content>
        <SingleChoice
          question={question}
          selectedIndex={selectedIndex}
          onSelect={(index) => {
            useQuizStore.setState((state) => {
              state.questionContainers[currentIndex].selectedIndex = index
            })
          }}
        />
      </Content>
      <Footer>
        <StyledButton
          disabled={currentIndex == 0}
          onClick={() => {
            previousQuestion()
          }}
        >
          Prev
        </StyledButton>
        <StyledButton
          // disabled={currentIndex == questions.length - 1}
          onClick={() => {
            nextQuestion()
          }}
        >
          Next
        </StyledButton>
      </Footer>
    </Container>
  )
}
