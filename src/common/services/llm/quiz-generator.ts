import { ChatPromptTemplate } from '@langchain/core/prompts'
import { LLMInvokeOption } from './llm-service'

export interface GenerateSingularChoiceInput {
  word: string
}

export interface QuizGenerator {
  generateSingularChoice(
    input: GenerateSingularChoiceInput,
    prompt: ChatPromptTemplate,
    option?: LLMInvokeOption,
  ): Promise<string>
}
