import { IterableReadableStream } from '@langchain/core/utils/stream'
import { LLMProvider } from './provider';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export const RouterLLMServiceToken = Symbol.for('router-llm-service')

export interface LLMInvokeOption {
  provider?: LLMProvider.Constant | null
}

export interface LLMInitOption {
  provider?: LLMProvider.Constant | null
  baseUrl?: string | null
  apiKey?: string | null
  model?: string | null
  temperature?: number | null
  response_format?: 'json' | null
}

export interface LLMService {

  getAvailable(
    option?: LLMInvokeOption,
  ): Promise<boolean>

  stream(
    input: any,
    prompt: string | ChatPromptTemplate,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>>

  invoke(
    input: any,
    prompt: string | ChatPromptTemplate,
    option?: LLMInvokeOption,
  ): Promise<string>

}
