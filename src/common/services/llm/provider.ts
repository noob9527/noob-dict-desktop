import { EnumClass, EnumFactory, EnumValue } from 'effective-enum'

@EnumClass
export class LLMProvider extends EnumFactory<LLMProvider>() {
  @EnumValue
  static readonly GEMINI = new LLMProvider(
    'GEMINI',
    'Gemini',
    Symbol.for('gemini-llm-service'),
    'gemini',
  )
  @EnumValue
  static readonly OPEN_AI = new LLMProvider(
    'OPEN_AI',
    'Open AI',
    Symbol.for('open-ai-llm-service'),
    'open_ai',
  )
  @EnumValue
  static readonly OLLAMA = new LLMProvider(
    'OLLAMA',
    'Ollama',
    Symbol.for('ollama-llm-service'),
    'ollama'
  )
  @EnumValue
  static readonly FAKE = new LLMProvider(
    'FAKE',
    'Fake',
    Symbol.for('fake-llm-service'),
    null,
  )

  constructor(
    public override name: string,
    public label: string,
    public serviceToken: symbol,
    public settingKey: string | null,
  ) {
    super()
  }
}

export namespace LLMProvider {
  export enum Constant {
    'GEMINI' = 'GEMINI',
    'OPEN_AI' = 'OPEN_AI',
    'OLLAMA' = 'OLLAMA',
    'FAKE' = 'FAKE',
  }
}
