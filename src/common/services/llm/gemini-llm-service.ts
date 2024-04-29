import { LLMService } from './llm-service'

export const GeminiLLMServiceToken = Symbol.for('gemini-llm-service')

export interface GeminiModelOption {
  apiKey?: string | null
}

export interface GeminiLLMService extends LLMService {
  init(option: GeminiModelOption)
}
