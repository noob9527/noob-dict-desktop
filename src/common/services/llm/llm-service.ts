import { IterableReadableStream } from '@langchain/core/utils/stream'
import { LLMProvider } from './provider';

export const RouterLLMServiceToken = Symbol.for('router-llm-service')

export interface LLMInvokeOption {
  provider?: LLMProvider.Constant | null
}

export interface LLMInitOption {
  provider?: LLMProvider.Constant | null
  baseUrl?: string | null
  apiKey?: string | null
  model?: string | null
}

export interface LLMService {
  getAvailable(
    option?: LLMInvokeOption,
  ): Promise<boolean>

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
