import { EnumClass, EnumFactory, EnumValue } from 'effective-enum'

@EnumClass
export class LLMProvider extends EnumFactory<LLMProvider>() {
  @EnumValue
  static readonly GEMINI = new LLMProvider('GEMINI', 'Gemini')
  @EnumValue
  static readonly OPEN_AI = new LLMProvider('OPEN_AI', 'Open AI')
  @EnumValue
  static readonly FAKE = new LLMProvider('FAKE', 'Fake')

  constructor(
    public override name: string,
    public label: string,
  ) {
    super()
  }
}

export namespace LLMProvider {
  export enum Constant {
    'GEMINI' = 'GEMINI',
    'OPEN_AI' = 'OPEN_AI',
    'FAKE' = 'FAKE',
  }
}
