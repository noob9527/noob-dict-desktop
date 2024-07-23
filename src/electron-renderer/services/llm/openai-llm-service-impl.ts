import { ChatOpenAI } from '@langchain/openai'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import { LLMInitOption } from '../../../common/services/llm/llm-service'

@injectable()
export class OpenAILLMServiceImpl extends AbstractLLMService {
  override createModel(option?: LLMInitOption): ChatOpenAI {
    const model = new ChatOpenAI({
      model: option?.model ?? undefined,
      apiKey: option?.apiKey ?? undefined,
      configuration: {
        baseURL: option?.baseUrl,
      },
      temperature: option?.temperature ?? 0,
    })

    if (option?.response_format == 'json') {
      model.bind({
        response_format: {
          type: 'json_object',
        },
      })
    }
    return model
  }
}
