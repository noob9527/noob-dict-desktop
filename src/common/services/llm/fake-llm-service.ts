import { LLMService } from './llm-service'

export const FakeLLMServiceToken = Symbol.for('fake-llm-service')

export interface FakeLLMService extends LLMService {}
