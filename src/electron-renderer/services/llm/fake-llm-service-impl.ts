import { FakeLLMService } from '../../../common/services/llm/fake-llm-service'
import { FakeListChatModel } from '@langchain/core/utils/testing'
import { OpenAIModelOption } from '../../../common/services/llm/open-ai-llm-service'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'
import { LLMInvokeOption } from '../../../common/services/llm/llm-service'
import { textPlaceholder } from '../../../browser/pages/textarea/utils'

@injectable()
export class FakeLLMServiceImpl
  extends AbstractLLMService
  implements FakeLLMService
{
  private _model: FakeListChatModel | null = null

  constructor() {
    super()
    this.init({})
  }

  init(option: OpenAIModelOption) {
    this._model = new FakeListChatModel({
      responses: [
        '1st: ' + textPlaceholder,
        "2nd: I'll callback later.",
        "3rd: You 'console' them!",
      ],
      sleep: 30,
    })
  }

  fetchModel(option: LLMInvokeOption): BaseChatModel | null {
    return this._model
  }
}
