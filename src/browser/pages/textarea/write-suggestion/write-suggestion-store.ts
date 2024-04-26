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

interface WriteSuggestionState {
  raw: string
  generatedText: string
  changing: boolean
  generating: boolean
  mock: boolean
}

const initialState: WriteSuggestionState = {
  raw: textPlaceholder,
  generatedText: textPlaceholder,
  changing: false,
  generating: false,
  mock: true,
}

const useWriteSuggestionStoreBase = create<WriteSuggestionState>()(
  devtools(() => initialState, {
    name: 'write_suggestion',
    enabled: Runtime.isDev,
  }),
)

export const useWriteSuggestionStore = createSelectors(useWriteSuggestionStoreBase)

const geminiLLMService = rendererContainer.get<GeminiLLMService>(
  GeminiLLMServiceToken,
)

export namespace WriteSuggestionActions {
  export async function translate() {
    useWriteSuggestionStore.setState({
      changing: false,
    })

    const state = useWriteSuggestionStore.getState()
    if (!state.raw.trim()) return

    const stream = await geminiLLMService.writeSuggestion(state.raw)
    let firstChunk = true
    for await (const chunk of stream) {
      const { generating, generatedText } = useWriteSuggestionStore.getState()
      if (generating || firstChunk) {
        useWriteSuggestionStore.setState({
          generatedText: generatedText + chunk,
          generating: true,
        })
      }
      firstChunk = false
    }
    useWriteSuggestionStore.setState({
      generating: false,
    })
  }

  async function mockTranslate() {
    const state = useWriteSuggestionStore.getState()
    useWriteSuggestionStore.setState({
      changing: false,
    })

    if (!state.raw.trim()) return
    const stream = mockStream(state.raw)

    let firstChunk = true
    for await (const chunk of stream) {
      const { generating, generatedText } = useWriteSuggestionStore.getState()
      if (generating || firstChunk) {
        useWriteSuggestionStore.setState({
          generatedText: generatedText + chunk,
          generating: true,
        })
      }
      firstChunk = false
    }

    useWriteSuggestionStore.setState({
      generating: false,
    })
  }

  export const debouncedTranslate = debounce(translate, 1000)
  export const debouncedMockTranslate = debounce(mockTranslate, 1000)

  export function changeRawText(rawText: string) {
    useWriteSuggestionStore.setState({
      raw: rawText,
      changing: true,
      generating: false,
      generatedText: '',
    })

    const mock = useWriteSuggestionStore.getState().mock
    if (mock) {
      debouncedMockTranslate()
    } else {
      debouncedTranslate()
    }
  }
}
