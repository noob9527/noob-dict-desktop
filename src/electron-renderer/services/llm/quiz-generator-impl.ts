import { ChatPromptTemplate } from '@langchain/core/prompts'
import {
  LLMInitOption,
  RouterLLMServiceToken,
} from '../../../common/services/llm/llm-service'
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
import logger from '../../../electron-shared/logger'

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
    maxRetryTimes: number = 2,
  ): Promise<SingleChoiceQuestion> {
    const model = this.routerLLMService.createModel(option)

    let times = 0
    while (times < maxRetryTimes) {
      const res = await prompt.pipe(model).pipe(this.outputParser).invoke(input)

      // try our best to extract json from response
      const obj = getJsonObj(res)
      if (isSingleChoiceQuestion(obj)) {
        const res = { ...obj, word: input.text }
        return res
      } else {
        let message = `Generation failed! 
        Retry Times: ${times}
        LLM output: '${res}', 
        LLM option: '${JSON.stringify(option)}'
        `
        if (++times >= maxRetryTimes) {
          throw new Error(message)
        } else {
          this.log.warn(message)
        }
      }
    }
    throw new Error('Should not reach here!')
  }

  async generateSingularChoiceBatch(
    inputs: GenerateSingularChoiceInput[],
    prompt: ChatPromptTemplate,
    option?: LLMInitOption,
    maxRetryTimes: number = 2,
  ): Promise<SingleChoiceQuestion[]> {
    const res = await Promise.all(
      inputs.map((e) => {
        return this.generateSingularChoice(
          e,
          prompt,
          option,
          maxRetryTimes,
        ).catch((e) => {
          this.log.error(e.message)
          return null
        })
      }),
    )
    return res.filter((e) => !!e) as SingleChoiceQuestion[]
  }
}
