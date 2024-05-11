import { FakeListChatModel } from '@langchain/core/utils/testing'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'
import {
  LLMInitOption,
  LLMInvokeOption,
} from '../../../common/services/llm/llm-service'
import { textPlaceholder } from '../../../browser/pages/textarea/utils'
import { Runtime } from '../../../electron-shared/runtime';

@injectable()
export class FakeLLMServiceImpl extends AbstractLLMService {
  private _model: FakeListChatModel | null = null

  constructor() {
    super()
    this.init({})
  }

  init(option: LLMInitOption) {
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

  override getAvailable(option?: LLMInvokeOption): Promise<boolean> {
    return Promise.resolve(Runtime.isDev)
  }
}
