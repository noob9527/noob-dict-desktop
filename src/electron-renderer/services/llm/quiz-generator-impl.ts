import { ChatPromptTemplate } from '@langchain/core/prompts'
import {
  LLMInitOption,
  LLMInvokeOption,
  RouterLLMServiceToken,
} from '../../../common/services/llm/llm-service';
import {
  GenerateSingularChoiceInput,
  isSingleChoiceQuestion,
  QuizGenerator,
  SingleChoiceQuestion,
} from '../../../common/services/llm/quiz-generator'
import { inject, injectable } from 'inversify'
import { RouterLLMServiceImpl } from './router-llm-service-impl'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { getJsonObj } from './json-parser'
import logger from '../../../electron-shared/logger';

@injectable()
export class QuizGeneratorImpl implements QuizGenerator {
  private outputParser = new StringOutputParser()
  private log = logger.getLogger(this.constructor.name)

  constructor(
    @inject(RouterLLMServiceToken)
    private routerLLMService: RouterLLMServiceImpl,
  ) {}

  async generateSingularChoice(
    input: GenerateSingularChoiceInput,
    prompt: ChatPromptTemplate,
    option?: LLMInitOption,
  ): Promise<SingleChoiceQuestion> {
    const model = this.routerLLMService.createModel(option)
    const res = await prompt
      .pipe(model)
      .pipe(this.outputParser)
      .invoke(input)
    // try our best to extract json from response
    const obj = getJsonObj(res)
    if (isSingleChoiceQuestion(obj)) {
      return obj
    } else {
      throw new Error(`Generation failed! LLM output: '${res}', LLM option: '${option}'`)
    }
  }
}
