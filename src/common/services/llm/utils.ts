import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts'
import { LLMInitOption } from './llm-service'
import { GeminiSetting, OllamaSetting, OpenAISetting } from '../../../electron-shared/user-profile/user-profile';
import { LLMProvider } from './provider'

export function toPromptTemplate(
  prompt: string | ChatPromptTemplate,
): ChatPromptTemplate {
  let pro: ChatPromptTemplate
  if (typeof prompt == 'string') {
    pro = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(prompt, {
        templateFormat: 'mustache',
      }),
    ])
  } else {
    pro = prompt
  }
  return pro
}

export function openAISettingToOption(setting: OpenAISetting): LLMInitOption {
  return {
    provider: LLMProvider.Constant.OPEN_AI,
    baseUrl: setting.base_url,
    model: setting.model_name,
    apiKey: setting.api_key,
  }
}

export function geminiSettingToOption(setting: GeminiSetting): LLMInitOption {
  return {
    provider: LLMProvider.Constant.GEMINI,
    apiKey: setting.api_key,
  }
}

export function ollamaSettingToOption(setting: OllamaSetting): LLMInitOption {
  return {
    provider: LLMProvider.Constant.OLLAMA,
    baseUrl: setting.base_url,
    model: setting.model_name,
  }
}
