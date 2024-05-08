export interface OpenAISetting {
  base_url?: string | null
  api_key?: string | null
  model_name?: string | null
}

export interface GeminiSetting {
  api_key?: string | null
}

export interface LLMSetting {
  open_ai?: OpenAISetting | null
  gemini?: GeminiSetting | null
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
