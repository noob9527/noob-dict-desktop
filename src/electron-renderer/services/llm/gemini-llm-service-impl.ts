import { ChatPromptTemplate } from '@langchain/core/prompts'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { Runnable, RunnableConfig } from '@langchain/core/runnables'
import { GeminiLLMService, GeminiModelOption } from '../../../common/services/llm/gemini-llm-service';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { enWriteSuggestionPrompt, wordEnToCnPrompt } from './prompts';
import { injectable } from 'inversify';

@injectable()
export class GeminiLLMServiceImpl implements GeminiLLMService {
  private _model: ChatGoogleGenerativeAI | null = null
  private outputParser = new StringOutputParser()

  constructor() {}

  get model(): ChatGoogleGenerativeAI {
    if (this._model == null) {
      throw new Error("Model hasn't been initialized yet!")
    } else {
      return this._model
    }
  }

  get wordEnToCnPrompt(): ChatPromptTemplate {
    return wordEnToCnPrompt
  }

  get wordEnToCnChain(): Runnable<any, string> {
    return this.wordEnToCnPrompt
      .pipe(this.model)
      .pipe(this.outputParser)
  }

  async wordEnToCn(text: string): Promise<IterableReadableStream<string>> {
    return this.wordEnToCnChain.stream({ text })
  }

  get writeSuggestionPrompt(): ChatPromptTemplate {
    return enWriteSuggestionPrompt
  }

  get writeSuggestionChain(): Runnable<any, string> {
    return this.writeSuggestionPrompt.pipe(this.model).pipe(this.outputParser)
  }

  async writeSuggestion(text: string): Promise<IterableReadableStream<string>> {
    return this.writeSuggestionChain.stream({text})
  }

  init(option: GeminiModelOption) {
    this._model = new ChatGoogleGenerativeAI({
      apiKey: option.apiKey ?? undefined,
      temperature: 0,
    })
  }
}
