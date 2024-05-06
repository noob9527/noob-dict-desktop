import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Runtime } from '../../../../electron-shared/runtime'
import { createSelectors } from '../../../zustand/create-selectors'
import { rendererContainer } from '../../../../common/container/renderer-container'
import {
  GeminiLLMService,
  GeminiLLMServiceToken,
} from '../../../../common/services/llm/gemini-llm-service'
import { debounce } from 'lodash'
import { mockStream, textPlaceholder } from '../utils'
import { detect, Language } from '../../../../common/utils/lan-detector';

interface TranslateState {
  raw: string

  detectedRawLanguage: Language | null,
  rawLanguage: Language | null,

  translatedText: string
  changing: boolean
  generating: boolean
  mock: boolean
}

const initialState: TranslateState = {
  raw: textPlaceholder,

  detectedRawLanguage:  null,
  rawLanguage: null,

  translatedText: textPlaceholder,
  changing: false,
  generating: false,
  mock: true,
}

const useTranslateStoreBase = create<TranslateState>()(
  devtools(() => initialState, {
    name: 'translate',
    enabled: Runtime.isDev,
  }),
)

export const useTranslateStore = createSelectors(useTranslateStoreBase)

const geminiLLMService = rendererContainer.get<GeminiLLMService>(
  GeminiLLMServiceToken,
)

export namespace TranslateActions {
  export async function translate() {
    useTranslateStore.setState({
      changing: false,
    })

    const state = useTranslateStore.getState()
    if (!state.raw.trim()) return

    const stream = await geminiLLMService.textAreaEnToCn(state.raw)
    let firstChunk = true
    for await (const chunk of stream) {
      const { generating, translatedText } = useTranslateStore.getState()
      if (generating || firstChunk) {
        useTranslateStore.setState({
          translatedText: translatedText + chunk,
          generating: true,
        })
      }
      firstChunk = false
    }
    useTranslateStore.setState({
      generating: false,
    })
  }

  async function mockTranslate() {
    const state = useTranslateStore.getState()
    useTranslateStore.setState({
      changing: false,
    })

    if (!state.raw.trim()) return
    const stream = mockStream(state.raw)

    let firstChunk = true
    for await (const chunk of stream) {
      const { generating, translatedText } = useTranslateStore.getState()
      if (generating || firstChunk) {
        useTranslateStore.setState({
          translatedText: translatedText + chunk,
          generating: true,
        })
      }
      firstChunk = false
    }

    useTranslateStore.setState({
      generating: false,
    })
  }

  function detectLanguage(rawText: string) {
    const lan = detect(rawText)
    useTranslateStore.setState({
      detectedRawLanguage: lan
    })
  }

  const debouncedTranslate = debounce(translate, 1000)
  const debouncedMockTranslate = debounce(mockTranslate, 1000)
  const debouncedDetectLanguage = debounce(detectLanguage, 1000)

  export function changeRawText(rawText: string) {
    useTranslateStore.setState({
      raw: rawText,
      changing: true,
      generating: false,
      translatedText: '',
    })

    const mock = useTranslateStore.getState().mock
    if (mock) {
      debouncedMockTranslate()
    } else {
      debouncedTranslate()
    }
    debouncedDetectLanguage(rawText)
  }
}
