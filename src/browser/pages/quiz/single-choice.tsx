import styled from 'styled-components'
import { ThemedContent } from '../../components/themed-ui/content/content'
import React from 'react'
import { SingleChoiceQuestion } from '../../../common/services/llm/quiz-generator'
import Markdown from 'react-markdown'
import ColorId from '../../styles/ColorId'

const Container = styled(ThemedContent)`
  display: flex;
  flex-direction: column;
  font-size: 1.5em;
`
const Question = styled.div``
const Choices = styled.div`
  margin-top: 5px;
`
const ChoiceContainer = styled.div`
  cursor: pointer;
  margin: 5px 0;
  padding: 5px 15px;

  &.correct {
    background-color: ${(props) => props.theme[ColorId.success]};
  }

  &.incorrect {
    background-color: ${(props) => props.theme[ColorId.error]};
  }
`
const Explanation = styled.div`
  margin-top: 5px;
`

export interface SingleChoiceProps {
  question: SingleChoiceQuestion
  selectedIndex?: number
  onSelect?: (number) => void
}

function indexToSeq(index: number): string {
  return String.fromCharCode('A'.charCodeAt(0) + index)
}

interface ChoiceProps {
  children: string
  index: number
  selected?: boolean
  correct: boolean
  showAnswer: boolean
  onClick?: (index: number, answer: string) => void
}

export const Choice: React.FC<ChoiceProps> = (props: ChoiceProps) => {
  const { children, selected, onClick, correct, showAnswer, index } = props
  const label = indexToSeq(index)
  let className = ''
  if (showAnswer) {
    if (correct) {
      className += ' correct'
    } else {
      if (selected) {
        className += ' incorrect'
      }
    }
  }
  return (
    <ChoiceContainer
      className={className}
      onClick={() => {
        onClick?.(index, children)
      }}
    >
      <span>{label}. </span>
      <span>{children}</span>
    </ChoiceContainer>
  )
}

export const SingleChoice: React.FC<SingleChoiceProps> = (
  props: SingleChoiceProps,
) => {
  const { question, choices, answer, explanation } = props.question
  const { selectedIndex } = props

  function handleSelect(answerIndex: number) {
    props.onSelect?.(answerIndex)
  }

  return (
    <Container>
      <Question>{question}</Question>
      <Choices>
        {choices.map((e, i) => (
          <Choice
            key={i}
            index={i}
            onClick={(e) => {
              handleSelect(i)
            }}
            showAnswer={selectedIndex !== undefined}
            selected={selectedIndex == i}
            correct={e == answer}
          >
            {e}
          </Choice>
        ))}
      </Choices>
      {props.selectedIndex !== undefined && (
        <Explanation>
          <header>Explanation:</header>
          <Markdown>{explanation}</Markdown>
        </Explanation>
      )}
    </Container>
  )
}
