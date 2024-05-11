import 'reflect-metadata'
import { OpenAILLMServiceImpl } from './openai-llm-service-impl'
import { ChatOpenAI } from '@langchain/openai/index';
import { assignWith } from 'lodash';
import { StringOutputParser } from '@langchain/core/output_parsers';

const XINFERENCE_BASE_URL = process.env['XINFERENCE_BASE_URL']
const OPEN_ROUTER_API_KEY = process.env['OPEN_ROUTER_API_KEY']

describe('OpenAILLMServiceImpl', () => {
  describe('init', () => {
    it('basic case', async () => {
      const service = new OpenAILLMServiceImpl()
      service.init({
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: OPEN_ROUTER_API_KEY,
      })
    })
  })

  describe('wordEnToCn', () => {
    let service: OpenAILLMServiceImpl
    beforeAll(() => {
      service = new OpenAILLMServiceImpl()
      service.init({
        model: 'mistralai/mistral-7b-instruct:free',
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: OPEN_ROUTER_API_KEY,
      })
    })

    it('basic case', async () => {
      const stream = await service.wordEnToCn('apple')

      for await (const chunk of stream) {
        console.log(chunk)
      }
    })
  })

})
