import { inject, injectable } from 'inversify'
import {
  LLMInvokeOption,
  LLMService,
} from '../../../common/services/llm/llm-service'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import {
  type FakeLLMService,
  FakeLLMServiceToken,
} from '../../../common/services/llm/fake-llm-service'
import {
  type GeminiLLMService,
  GeminiLLMServiceToken,
} from '../../../common/services/llm/gemini-llm-service'
import {
  type OpenAILLMService,
  OpenAILLMServiceToken,
} from '../../../common/services/llm/open-ai-llm-service'

@injectable()
export class RouterLLMServiceImpl implements LLMService {
  constructor(
    // see https://github.com/inversify/InversifyJS/issues/1004
    @inject(FakeLLMServiceToken) private fakeLLMService: FakeLLMService,
    @inject(GeminiLLMServiceToken) private geminiLLMService: GeminiLLMService,
    @inject(OpenAILLMServiceToken) private openAILLMService: OpenAILLMService,
  ) {}

  getService(option: LLMInvokeOption): LLMService {
    if (option.mock) {
      return this.fakeLLMService
    }
    switch (option.provider) {
      case 'GEMINI':
        return this.geminiLLMService
      case 'OPEN_AI':
        return this.openAILLMService
      default:
        throw Error(`unknown provider: ${option.provider}`)
    }
  }

  textAreaEnToCn(
    text: string,
    option: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return this.getService(option).textAreaEnToCn(text, option)
  }

  textAreaToEn(
    text: string,
    option: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return this.getService(option).textAreaToEn(text, option)
  }

  wordEnToCn(
    text: string,
    option: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return this.getService(option).wordEnToCn(text, option)
  }

  writeSuggestion(
    text: string,
    option: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return this.getService(option).writeSuggestion(text, option)
  }
}
