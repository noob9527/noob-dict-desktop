import { LLMService } from './llm-service'

export const OpenAILLMServiceToken = Symbol.for('open-ai-llm-service')

export interface OpenAIModelOption {
  baseURL?: string | null
  model?: string | null
  apiKey?: string | null
}

export interface OpenAILLMService extends LLMService {
  init(option: OpenAIModelOption)
}
