import { LLMService } from './llm-service'

export const CustomLLMServiceToken = Symbol.for('custom-llm-service')

export interface CustomLLMService extends LLMService {}
