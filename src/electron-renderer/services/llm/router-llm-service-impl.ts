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
import { LLMProvider } from '../../../common/services/llm/provider';

@injectable()
export class RouterLLMServiceImpl implements LLMService {
  constructor(
    // see https://github.com/inversify/InversifyJS/issues/1004
    @inject(FakeLLMServiceToken) private fakeLLMService: FakeLLMService,
    @inject(GeminiLLMServiceToken) private geminiLLMService: GeminiLLMService,
    @inject(OpenAILLMServiceToken) private openAILLMService: OpenAILLMService,
  ) {}

  async getAvailable(option?: LLMInvokeOption): Promise<boolean> {
    return this.getService(option)
      .getAvailable(option)
  }

  getService(option?: LLMInvokeOption): LLMService {
    switch (option?.provider) {
      case LLMProvider.Constant.GEMINI:
        return this.geminiLLMService
      case LLMProvider.Constant.OPEN_AI:
        return this.openAILLMService
      case LLMProvider.Constant.FAKE:
        return this.fakeLLMService
      case null:
        return this.fakeLLMService
      default:
        throw Error(`unknown provider: ${option?.provider}`)
    }
  }

  textAreaEnToCn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return this.getService(option).textAreaEnToCn(text, option)
  }

  textAreaToEn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return this.getService(option).textAreaToEn(text, option)
  }

  wordEnToCn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return this.getService(option).wordEnToCn(text, option)
  }

  writeSuggestion(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return this.getService(option).writeSuggestion(text, option)
  }
}
