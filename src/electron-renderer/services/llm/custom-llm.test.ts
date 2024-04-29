import { CustomLLM } from './custom-llm'

const OPEN_ROUTER_API_KEY = process.env['OPEN_ROUTER_API_KEY']
const XINFERENCE_BASE_URL = process.env['XINFERENCE_BASE_URL']

xdescribe('CustomLLM', () => {
  describe('init', () => {
    it('basic case', async () => {
      const llm = new CustomLLM({
        baseUrl: XINFERENCE_BASE_URL!!,
        model_name: 'qwen1.5-chat',
      })

      const res = await llm.invoke("What is the largest animal?")
      console.log(res)
    })
  })
})
