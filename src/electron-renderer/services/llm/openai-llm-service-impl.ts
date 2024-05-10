import {
  OpenAILLMService,
  OpenAIModelOption,
} from '../../../common/services/llm/open-ai-llm-service'
import { ChatOpenAI } from '@langchain/openai'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import { LLMInvokeOption } from '../../../common/services/llm/llm-service'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'

@injectable()
export class OpenAILLMServiceImpl
  extends AbstractLLMService
  implements OpenAILLMService
{
  private _model: ChatOpenAI | null = null

  init(option: OpenAIModelOption) {
    this._model = new ChatOpenAI({
      model: option.model ?? undefined,
      apiKey: option.apiKey ?? undefined,
      configuration: {
        baseURL: option.baseURL,
      },
      temperature: 0,
    })
  }

  fetchModel(option: LLMInvokeOption): BaseChatModel | null {
    return this._model
  }
}
