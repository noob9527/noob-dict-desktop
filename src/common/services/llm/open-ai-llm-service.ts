import { ChatPromptTemplate } from '@langchain/core/prompts'
import { IterableReadableStream } from '@langchain/core/utils/stream'

export const OpenAILLMServiceToken = Symbol.for('open-ai-llm-service')

export interface OpenAIModelOption {
  baseUrl: string
  apiKey?: string | null
}

export interface OpenAILLMService {
  init(option: OpenAIModelOption)

  translate(text: string): Promise<IterableReadableStream<string>>

  writeSuggestion(text: string): Promise<IterableReadableStream<string>>

  translatePrompt: ChatPromptTemplate
  writeSuggestionPrompt: ChatPromptTemplate
}
