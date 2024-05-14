import 'reflect-metadata'
import { GeminiLLMServiceImpl } from './gemini-llm-service-impl';
import { defaultPromptTpls } from '../../../common/services/llm/prompts/prompts';

const GEMINI_API_KEY= process.env['GEMINI_API_KEY']

xdescribe('GeminiLLMServiceImpl', () => {
  describe('init', () => {
    it('basic case', async () => {
      const service = new GeminiLLMServiceImpl()
      service.init({
        apiKey: GEMINI_API_KEY,
      })
    })
  })

  describe('wordEnToCn', () => {
    let service: GeminiLLMServiceImpl
    beforeAll(() => {
      service = new GeminiLLMServiceImpl()
      service.init({
        apiKey: GEMINI_API_KEY,
      })
    })

    it('basic case', async () => {
      const stream = await service.stream(
        {text: 'apple'},
        defaultPromptTpls.trans_word_en_to_cn
      )
      for await (const chunk of stream) {
        console.log(chunk)
      }
    })
  })
})
