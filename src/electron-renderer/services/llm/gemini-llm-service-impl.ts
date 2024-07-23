import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import { LLMInitOption } from '../../../common/services/llm/llm-service'

@injectable()
export class GeminiLLMServiceImpl extends AbstractLLMService {
  override createModel(option?: LLMInitOption): ChatGoogleGenerativeAI {
    return new ChatGoogleGenerativeAI({
      apiKey: option?.apiKey ?? undefined,
      temperature: option?.temperature ?? 0,
    })
  }
}
