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
  'llm.openai.base_url': string | null
  'llm.openai.api_key': string | null
  'llm.openai.model_name': string | null

  // gemini
  'llm.gemini.api_key': string | null,
}
