import { type BaseLLMParams, LLM } from '@langchain/core/language_models/llms'
import type { CallbackManagerForLLMRun } from 'langchain/callbacks'
import { GenerationChunk } from '@langchain/core/outputs'
import axios, { AxiosInstance, AxiosProxyConfig } from 'axios'

export interface CustomLLMInput extends BaseLLMParams {
  baseUrl: string
  model_name: string
  temperature?: number

  // `proxy` defines the hostname, port, and protocol of the proxy server.
  // You can also define your proxy using the conventional `http_proxy` and
  // `https_proxy` environment variables. If you are using environment variables
  // for your proxy configuration, you can also define a `no_proxy` environment
  // variable as a comma-separated list of domains that should not be proxied.
  // Use `false` to disable proxies, ignoring environment variables.
  // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
  // supplies credentials.
  // This will set an `Proxy-Authorization` header, overwriting any existing
  // `Proxy-Authorization` custom headers you have set using `headers`.
  // If the proxy server uses HTTPS, then you must set the protocol to `https`.
  proxy?: AxiosProxyConfig | false
}

/**
 * https://js.langchain.com/docs/modules/model_io/llms/custom_llm
 */
export class CustomLLM extends LLM {
  baseUrl: string
  model_name: string
  temperature?: number
  axios: AxiosInstance

  constructor(fields: CustomLLMInput) {
    super(fields)
    this.baseUrl = fields.baseUrl
    this.model_name = fields.model_name
    this.temperature = fields.temperature
    this.axios = axios.create({
      baseURL: fields.baseUrl,
      proxy: fields.proxy,
    })
  }

  _llmType() {
    return 'custom'
  }

  async _call(
    prompt: string,
    options: this['ParsedCallOptions'],
    runManager: CallbackManagerForLLMRun,
  ): Promise<string> {
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());

    const res = await this.axios
      .post('/chat/completions', {
        model: this.model_name,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: this.temperature,
      })
      .then((e) => e.data)

    return res['choices'][0]['message']['content']
  }

  override async *_streamResponseChunks(
    prompt: string,
    options: this['ParsedCallOptions'],
    runManager?: CallbackManagerForLLMRun,
  ): AsyncGenerator<GenerationChunk> {
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());
    const res = prompt.slice(0, 0)

    for (const letter of res) {
      yield new GenerationChunk({
        text: letter,
      })
      // Trigger the appropriate callback
      await runManager?.handleLLMNewToken(letter)
    }
  }
}
