import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import {
  LLMInitOption,
  LLMInvokeOption,
} from '../../../common/services/llm/llm-service'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'
import { ChatOllama } from '@langchain/community/chat_models/ollama'

@injectable()
export class OllamaLLMServiceImpl extends AbstractLLMService {
  private _model: ChatOllama | null = null

  init(option: LLMInitOption) {
    this._model = new ChatOllama({
      model: option.model ?? undefined,
      baseUrl: option.baseUrl ?? undefined,
      temperature: 0,
    })
  }

  fetchModel(option: LLMInvokeOption): BaseChatModel | null {
    return this._model
  }
}
