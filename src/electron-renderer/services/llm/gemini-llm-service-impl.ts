import {
  GeminiLLMService,
  GeminiModelOption,
} from '../../../common/services/llm/gemini-llm-service'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import { LLMInvokeOption } from '../../../common/services/llm/llm-service';
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';

@injectable()
export class GeminiLLMServiceImpl
  extends AbstractLLMService
  implements GeminiLLMService
{
  private _model: ChatGoogleGenerativeAI | null = null

  init(option: GeminiModelOption) {
    if (!option.apiKey) this._model = null
    this._model = new ChatGoogleGenerativeAI({
      apiKey: option.apiKey ?? undefined,
      temperature: 0,
    })
  }

  getModel(option: LLMInvokeOption): BaseChatModel {
    if (this._model == null) {
      throw new Error("Model hasn't been initialized yet!")
    } else {
      return this._model
    }
  }
}
