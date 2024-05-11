import { ChatOpenAI } from '@langchain/openai'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import {
  LLMInitOption,
  LLMInvokeOption,
} from '../../../common/services/llm/llm-service'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'

@injectable()
export class OpenAILLMServiceImpl extends AbstractLLMService {
  private _model: ChatOpenAI | null = null

  init(option: LLMInitOption) {
    this._model = new ChatOpenAI({
      model: option.model ?? undefined,
      apiKey: option.apiKey ?? undefined,
      configuration: {
        baseURL: option.baseUrl,
      },
      temperature: 0,
    })
  }

  fetchModel(option: LLMInvokeOption): BaseChatModel | null {
    return this._model
  }
}
