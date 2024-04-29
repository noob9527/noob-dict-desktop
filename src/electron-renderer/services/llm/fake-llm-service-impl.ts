import { FakeLLMService } from '../../../common/services/llm/fake-llm-service'
import { FakeListChatModel } from '@langchain/core/utils/testing'
import { OpenAIModelOption } from '../../../common/services/llm/open-ai-llm-service'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'
import { LLMInvokeOption } from '../../../common/services/llm/llm-service'

@injectable()
export class FakeLLMServiceImpl
  extends AbstractLLMService
  implements FakeLLMService
{
  private _model: FakeListChatModel | null = null

  init(option: OpenAIModelOption) {
    this._model = new FakeListChatModel({
      responses: ["I'll callback later.", "You 'console' them!"],
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
