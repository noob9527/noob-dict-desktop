import { FakeListChatModel } from '@langchain/core/utils/testing'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import {
  LLMInitOption,
  LLMInvokeOption,
} from '../../../common/services/llm/llm-service'
import { textPlaceholder } from '../../../browser/pages/textarea/utils'
import { Runtime } from '../../../electron-shared/runtime'

@injectable()
export class FakeLLMServiceImpl extends AbstractLLMService {
  constructor() {
    super()
    this.init({})
  }

  override createModel(option?: LLMInitOption): FakeListChatModel {
    return new FakeListChatModel({
      responses: [
        '1st: ' + textPlaceholder,
        "2nd: I'll callback later.",
        "3rd: You 'console' them!",
      ],
      sleep: 30,
    })
  }

  override getAvailable(option?: LLMInvokeOption): Promise<boolean> {
    return Promise.resolve(Runtime.isDev)
  }
}
