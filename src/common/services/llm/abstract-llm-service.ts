import { LLMInvokeOption, LLMService } from './llm-service'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import {
  enWriteSuggestionPrompt,
  textAreaEnToCnPrompt,
  textAreaToEnPrompt,
  wordEnToCnPrompt,
} from './prompts'
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractLLMService implements LLMService {
  protected outputParser = new StringOutputParser()

  abstract getModel(option?: LLMInvokeOption): BaseChatModel

  textAreaEnToCn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return textAreaEnToCnPrompt
      .pipe(this.getModel(option))
      .pipe(this.outputParser)
      .stream({ text })
  }

  textAreaToEn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return textAreaToEnPrompt
      .pipe(this.getModel(option))
      .pipe(this.outputParser)
      .stream({ text })
  }

  wordEnToCn(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return wordEnToCnPrompt
      .pipe(this.getModel(option))
      .pipe(this.outputParser)
      .stream({ text })
  }

  writeSuggestion(
    text: string,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    return enWriteSuggestionPrompt
      .pipe(this.getModel(option))
      .pipe(this.outputParser)
      .stream({ text })
  }
}
