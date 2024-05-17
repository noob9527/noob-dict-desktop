import { ChatPromptTemplate } from '@langchain/core/prompts'
import { LLMInitOption, LLMInvokeOption } from './llm-service';
import { isEqual } from 'lodash';

export const QuizGeneratorToken = Symbol.for('quiz-generator')

export interface GenerateSingularChoiceInput {
  text: string
}

export interface SingleChoiceQuestion {
  question: string
  choices: string[]
  answer: string
  explanation: string
}

const sample: SingleChoiceQuestion = {
  question: '',
  choices: [],
  answer: '',
  explanation: '',
}

export function isSingleChoiceQuestion(obj: any): obj is SingleChoiceQuestion {
  if (!obj) return false
  return isEqual(Object.keys(sample), Object.keys(obj))
    && Array.isArray(obj.choices) && obj.choices.length == 4
}

export interface QuizGenerator {
  generateSingularChoice(
    input: GenerateSingularChoiceInput,
    prompt: ChatPromptTemplate,
    option?: LLMInitOption,
    maxRetryTimes?: number,
  ): Promise<SingleChoiceQuestion>

  generateSingularChoiceBatch(
    length: number,
    input: GenerateSingularChoiceInput,
    prompt: ChatPromptTemplate,
    option?: LLMInitOption,
    maxRetryTimes?: number,
  ): Promise<SingleChoiceQuestion[]>
}
