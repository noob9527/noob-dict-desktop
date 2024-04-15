import { GeminiLLMServiceImpl } from './gemini-llm-service-impl';

const GEMINI_API_KEY= process.env['GEMINI_API_KEY']

describe('GeminiLLMServiceImpl', () => {
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
      const stream = await service.wordEnToCn('apple')

      for await (const chunk of stream) {
        console.log(chunk)
      }
    })
  })
})
