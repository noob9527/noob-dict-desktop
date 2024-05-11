import { inject, injectable } from 'inversify'
import {
  LLMInitOption,
  LLMInvokeOption,
  type LLMService,
} from '../../../common/services/llm/llm-service'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { LLMProvider } from '../../../common/services/llm/provider'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'

@injectable()
export class RouterLLMServiceImpl implements LLMService {
  constructor(
    // see https://github.com/inversify/InversifyJS/issues/1004
    @inject(LLMProvider.FAKE.serviceToken)
    private fakeLLMService: AbstractLLMService,
    @inject(LLMProvider.GEMINI.serviceToken)
    private geminiLLMService: AbstractLLMService,
    @inject(LLMProvider.OPEN_AI.serviceToken)
    private openAILLMService: AbstractLLMService,
    @inject(LLMProvider.OLLAMA.serviceToken)
    private ollamaLLMService: AbstractLLMService,
  ) {}

  async getAvailable(option?: LLMInvokeOption): Promise<boolean> {
    return this.getService(option).getAvailable(option)
  }

  init(option: LLMInitOption) {
    this.getService(option).init(option)
  }

  getService(option?: LLMInvokeOption): AbstractLLMService {
    switch (option?.provider) {
      case LLMProvider.Constant.GEMINI:
        return this.geminiLLMService
      case LLMProvider.Constant.OPEN_AI:
        return this.openAILLMService
      case LLMProvider.Constant.OLLAMA:
        return this.ollamaLLMService
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
