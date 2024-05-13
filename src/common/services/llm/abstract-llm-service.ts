import { LLMInitOption, LLMInvokeOption, LLMService } from './llm-service';
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { injectable } from 'inversify';
import { ChatPromptTemplate } from '@langchain/core/prompts';

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

  invoke(
    input: any,
    prompt: string | ChatPromptTemplate,
    option?: LLMInvokeOption,
  ): Promise<IterableReadableStream<string>> {
    let pro: ChatPromptTemplate
    if (typeof prompt == 'string') {
      pro = ChatPromptTemplate.fromMessages([
        ['human', prompt],
      ])
    } else {
      pro = prompt
    }
    return pro
      .pipe(this.getModel(option))
      .pipe(this.outputParser)
      .stream(input)
  }

}
