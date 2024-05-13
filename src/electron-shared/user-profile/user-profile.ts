import { Workflow } from '../../common/services/llm/workflow';

export interface OpenAISetting {
  base_url?: string | null
  api_key?: string | null
  model_name?: string | null
}

export interface GeminiSetting {
  api_key?: string | null
}

export interface OllamaSetting {
  base_url?: string | null
  model_name?: string | null
}

export type PromptSetting  = {
  [index in Workflow]: string | null
}

export interface LLMProviderSetting {
  open_ai?: OpenAISetting | null
  gemini?: GeminiSetting | null
  ollama?: OllamaSetting | null
}

export interface LLMSetting {
  providers: LLMProviderSetting
  prompts?: PromptSetting
}

export interface UserProfile {
  appHotKey: string | null
  readClipboard: boolean
  ecDictFileLocation: string | null
  dbFileLocation: string | null

  // sync when quit app
  'search.syncHistory.syncOnQuit': boolean
  // sync when start up app
  'search.syncHistory.syncOnStart': boolean

  // sync interval in background, set to negative to disable
  'search.syncHistory.syncIntervalMinutes': number

  // openai
  llm: LLMSetting
}
