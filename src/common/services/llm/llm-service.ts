import { IterableReadableStream } from '@langchain/core/utils/stream'

export const RouterLLMServiceToken = Symbol.for('router-llm-service')

export interface LLMInvokeOption {
  mock: boolean
  provider: 'OPEN_AI' | 'GEMINI'
}

export interface LLMService {
  wordEnToCn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>>

  textAreaEnToCn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>>

  textAreaToEn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>>

  writeSuggestion(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>>
}
