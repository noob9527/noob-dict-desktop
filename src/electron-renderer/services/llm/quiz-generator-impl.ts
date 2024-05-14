import { ChatPromptTemplate } from '@langchain/core/prompts'
import {
  LLMInvokeOption,
  type LLMService,
  RouterLLMServiceToken,
} from '../../../common/services/llm/llm-service'
import {
  GenerateSingularChoiceInput,
  QuizGenerator,
} from '../../../common/services/llm/quiz-generator'
import { inject, injectable } from 'inversify'

@injectable()
export class QuizGeneratorImpl implements QuizGenerator {
  constructor(
    @inject(RouterLLMServiceToken)
    private routerLLMService: LLMService,
  ) {}

  async generateSingularChoice(
    input: GenerateSingularChoiceInput,
    prompt: ChatPromptTemplate,
    option?: LLMInvokeOption,
  ): Promise<string> {
    return ''
  }
}
