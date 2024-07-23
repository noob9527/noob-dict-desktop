import { LLMInitOption, LLMInvokeOption, LLMService } from './llm-service'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { injectable } from 'inversify'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import logger from '../../../electron-shared/logger'
import { toPromptTemplate } from './utils'

@injectable()
export abstract class AbstractLLMService implements LLMService {
  protected outputParser = new StringOutputParser()
  protected _model: BaseChatModel | null = null
  private log = logger.getLogger(this.constructor.name)

  abstract createModel(option?: LLMInitOption): BaseChatModel

  init(option: LLMInitOption) {
    try {
      this._model = this.createModel(option)
    } catch (e) {
      this.log.error(e)
    }
  }

  getModel() {
    const model = this._model
    if (model == null) {
      throw new Error("Model hasn't been initialized yet!")
    } else {
      return model
    }
  }

  getAvailable(option?: LLMInvokeOption): Promise<boolean> {
    return Promise.resolve(this._model != null)
  }

  stream(
    input: any,
    prompt: string | ChatPromptTemplate,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    let pro = toPromptTemplate(prompt)
    return pro.pipe(this.getModel()).pipe(this.outputParser).stream(input)
  }

  invoke(
    input: any,
    prompt: string | ChatPromptTemplate,
    option?: LLMInvokeOption,
  ): Promise<string> {
    let pro = toPromptTemplate(prompt)
    return pro.pipe(this.getModel()).pipe(this.outputParser).invoke(input)
  }
}
