import { ChatPromptTemplate } from '@langchain/core/prompts'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { textAreaEnToCnPrompt } from '../../../electron-renderer/services/llm/prompts';

export const GeminiLLMServiceToken = Symbol.for('gemini-llm-service')

export interface GeminiModelOption {
  apiKey?: string | null
}

export interface GeminiLLMService {
  init(option: GeminiModelOption)

  wordEnToCn(text: string): Promise<IterableReadableStream<string>>
  textAreaEnToCn(text: string): Promise<IterableReadableStream<string>>

  writeSuggestion(text: string): Promise<IterableReadableStream<string>>

  wordEnToCnPrompt: ChatPromptTemplate
  writeSuggestionPrompt: ChatPromptTemplate
}
