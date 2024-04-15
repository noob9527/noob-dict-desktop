import {
  OpenAILLMService,
  OpenAIModelOption,
} from '../../../common/services/llm/open-ai-llm-service'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { Runnable, RunnableConfig } from '@langchain/core/runnables'
import { injectable } from 'inversify';

@injectable()
export class OpenAILLMServiceImpl implements OpenAILLMService {
  private _model: ChatOpenAI | null = null
  private outputParser = new StringOutputParser()

  constructor() {}

  get model(): ChatOpenAI {
    if (this._model == null) {
      throw new Error("Model hasn't been initialized yet!")
    } else {
      return this._model
    }
  }

  get translatePrompt(): ChatPromptTemplate {
    return ChatPromptTemplate.fromMessages([
      ['human', 'Tell me a short joke about {text}'],
    ])
  }

  get translateChain(): Runnable<any, string> {
    return this.translatePrompt.pipe(this.model).pipe(this.outputParser)
  }

  async translate(text: string): Promise<IterableReadableStream<string>> {
    return this.translateChain.stream({ text })
  }

  get writeSuggestionPrompt(): ChatPromptTemplate {
    return ChatPromptTemplate.fromMessages([
      ['human', 'Tell me a short joke about {text}'],
    ])
  }

  get writeSuggestionChain(): Runnable<any, string> {
    return this.writeSuggestionPrompt.pipe(this.model).pipe(this.outputParser)
  }

  async writeSuggestion(text: string): Promise<IterableReadableStream<string>> {
    return this.writeSuggestionChain.stream({text})
  }

  init(option: OpenAIModelOption) {
    this._model = new ChatOpenAI({
      apiKey: option.apiKey ?? undefined,
      configuration: {
        baseURL: option.baseUrl,
      },
      temperature: 0,
    })
  }
}
