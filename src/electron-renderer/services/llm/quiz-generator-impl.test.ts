import 'reflect-metadata'
import { ChatOpenAI } from '@langchain/openai'
import { StringOutputParser } from '@langchain/core/output_parsers'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts'
import { quiz_singular_choice, quiz_singular_choice_text } from '../../../common/services/llm/prompts/quiz-prompts';
import { ChatOllama } from '@langchain/community/chat_models/ollama';

const XINFERENCE_BASE_URL = process.env['XINFERENCE_BASE_URL']
const OPEN_ROUTER_API_KEY = process.env['OPEN_ROUTER_API_KEY']

describe('QuizGenerator', () => {
  describe('OpenRouter llama3', () => {
    let model: ChatOpenAI | null = null
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(quiz_singular_choice, {
        templateFormat: 'mustache',
      })
    ])
    beforeAll(() => {
      model = new ChatOpenAI({
        model: 'meta-llama/llama-3-8b-instruct:free',
        // model: 'mistralai/mistral-7b-instruct:free',
        apiKey: OPEN_ROUTER_API_KEY,
        configuration: {
          baseURL: 'https://openrouter.ai/api/v1',
        },
        temperature: 1.0,
      })

      model.bind({
        response_format: {
          type: "json_object",
        },
      })
    })

    it('basic case', async () => {
      const parser = new StringOutputParser()
      // const res = await prompt.format({text: 'foo'})
      const res = await prompt
        .pipe(model!!)
        .pipe(parser)
        .invoke({ text: 'indulge' })
      console.log(res)
    })
  })

  describe('Ollama llama3', () => {
    let model: ChatOllama | null = null
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(quiz_singular_choice, {
        templateFormat: 'mustache',
      })
    ])
    beforeAll(() => {
      model = new ChatOllama({
        model: 'llama3',
        temperature: 1.0,
        format: 'json',
      })
    })

    it('basic case', async () => {
      const parser = new StringOutputParser()
      // const res = await prompt.format({text: 'foo'})
      const res = await prompt
        .pipe(model!!)
        .pipe(parser)
        .invoke({ text: 'indulge' })
      console.log(res)
    })
  })
})
