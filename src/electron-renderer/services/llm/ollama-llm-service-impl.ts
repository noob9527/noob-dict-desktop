import { injectable } from 'inversify'
import { AbstractLLMService } from '../../../common/services/llm/abstract-llm-service'
import { LLMInitOption } from '../../../common/services/llm/llm-service'
import { ChatOllama } from '@langchain/community/chat_models/ollama'

@injectable()
export class OllamaLLMServiceImpl extends AbstractLLMService {
  override createModel(option?: LLMInitOption): ChatOllama {
    return new ChatOllama({
      model: option?.model ?? undefined,
      baseUrl: option?.baseUrl ?? undefined,
      temperature: option?.temperature ?? 0,
      format: option?.response_format ?? undefined,
    })
  }
}
