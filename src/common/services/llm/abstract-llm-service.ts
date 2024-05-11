import { LLMInitOption, LLMInvokeOption, LLMService } from './llm-service';
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

  abstract fetchModel(option?: LLMInvokeOption): BaseChatModel | null

  abstract init(option: LLMInitOption)

  getModel(option?: LLMInvokeOption) {
    const model = this.fetchModel(option)
    if (model == null) {
      throw new Error("Model hasn't been initialized yet!")
    } else {
      return model
    }
  }

  getAvailable(option?: LLMInvokeOption): Promise<boolean> {
    return Promise.resolve(this.fetchModel(option) != null)
  }

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
