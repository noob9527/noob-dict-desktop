import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { debounce } from 'lodash'
import { detect, Language } from '../../../common/utils/lan-detector';
import { mockStream, textPlaceholder } from './utils';
import { createSelectors } from '../../zustand/create-selectors';
import { rendererContainer } from '../../../common/container/renderer-container';
import { GeminiLLMService, GeminiLLMServiceToken } from '../../../common/services/llm/gemini-llm-service';
import { Runtime } from '../../../electron-shared/runtime';

interface TranslateState {
  raw: string

  detectedRawLanguage: Language | null,
  rawLanguage: Language | null,

  generatedText: string
  translatedText: string
  changing: boolean
  generating: boolean
  mock: boolean
}

const initialState: TranslateState = {

  detectedRawLanguage:  null,
  rawLanguage: null,

  raw: textPlaceholder,
  translatedText: textPlaceholder,
  // generatedText: textPlaceholder,

  // raw: '',
  // translatedText: '',
  generatedText: '',

  changing: false,
  generating: false,
  mock: true,
}

const useTextareaStoreBase = create<TranslateState>()(
  devtools(() => initialState, {
    name: 'textarea',
    enabled: Runtime.isDev,
  }),
)

export const useTextareaStore = createSelectors(useTextareaStoreBase)

const geminiLLMService = rendererContainer.get<GeminiLLMService>(
  GeminiLLMServiceToken,
)

export function useCurrentLan(): Language | null {
  const rawLanguage = useTextareaStore.use.rawLanguage()
  const detectedRawLanguage = useTextareaStore.use.detectedRawLanguage()
  return rawLanguage ?? detectedRawLanguage
}

export namespace TextareaActions {
  export async function translate() {
    useTextareaStore.setState({
      changing: false,
    })

    const state = useTextareaStore.getState()
    if (!state.raw.trim()) return

    const stream = await geminiLLMService.textAreaEnToCn(state.raw)
    let firstChunk = true
    for await (const chunk of stream) {
      const { generating, translatedText } = useTextareaStore.getState()
      if (generating || firstChunk) {
        useTextareaStore.setState({
          translatedText: translatedText + chunk,
          generating: true,
        })
      }
      firstChunk = false
    }
    useTextareaStore.setState({
      generating: false,
    })
  }

  async function mockTranslate() {
    const state = useTextareaStore.getState()
    useTextareaStore.setState({
      changing: false,
    })

    if (!state.raw.trim()) return
    const stream = mockStream(state.raw)

    let firstChunk = true
    for await (const chunk of stream) {
      const { generating, translatedText } = useTextareaStore.getState()
      if (generating || firstChunk) {
        useTextareaStore.setState({
          translatedText: translatedText + chunk,
          generating: true,
        })
      }
      firstChunk = false
    }

    useTextareaStore.setState({
      generating: false,
    })
  }

  function detectLanguage(rawText: string) {
    const lan = detect(rawText)
    useTextareaStore.setState({
      detectedRawLanguage: lan
    })
  }

  const debouncedTranslate = debounce(translate, 1000)
  const debouncedMockTranslate = debounce(mockTranslate, 1000)
  const debouncedDetectLanguage = debounce(detectLanguage, 1000)

  export function changeRawText(rawText: string) {
    useTextareaStore.setState({
      raw: rawText,
      changing: true,
      generating: false,
      translatedText: '',
    })

    const mock = useTextareaStore.getState().mock
    if (mock) {
      debouncedMockTranslate()
    } else {
      debouncedTranslate()
    }
    debouncedDetectLanguage(rawText)
  }
}
