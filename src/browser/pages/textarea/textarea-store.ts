import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { debounce } from 'lodash'
import { detect, Language } from '../../../common/utils/lan-detector'
import { createSelectors } from '../../zustand/create-selectors'
import { rendererContainer } from '../../../common/container/renderer-container'
import { Runtime } from '../../../electron-shared/runtime'
import { LLMProvider } from '../../../common/services/llm/provider'
import {
  LLMService,
  RouterLLMServiceToken,
} from '../../../common/services/llm/llm-service'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { immer } from 'zustand/middleware/immer'

export enum Tab {
  trans = 'trans',
  rewrite = 'rewrite',
}

interface LLMResult {
  input: string
  output: string
  provider: LLMProvider.Constant
}

interface LLMResultMap {
  versions: {
    [Tab.trans]: number
    [Tab.rewrite]: number
  }
  [Tab.trans]: LLMResult | null
  [Tab.rewrite]: LLMResult | null
}

interface TranslateState {
  raw: string

  detectedRawLanguage: Language | null
  rawLanguage: Language | null

  // writeSuggestionText: string
  // translatedText: string

  changing: boolean
  mock: boolean

  availableLLMProviders: LLMProvider.Constant[]
  selectedLLMProvider: LLMProvider.Constant | null

  resultMap: LLMResultMap

  currentTab: Tab
}

const initialState: TranslateState = {
  detectedRawLanguage: null,
  rawLanguage: null,

  // raw: textPlaceholder,

  raw: '',
  changing: false,
  mock: false,

  availableLLMProviders: [],
  selectedLLMProvider: null,
  resultMap: {
    versions: {
      [Tab.trans]: 0,
      [Tab.rewrite]: 0,
    },
    [Tab.trans]: null,
    [Tab.rewrite]: null,
  },

  currentTab: Tab.trans,
}

const useTextareaStoreBase = create<TranslateState>()(
  devtools(
    immer(() => initialState),
    {
      name: 'textarea',
      enabled: Runtime.isDev,
    },
  ),
)

export const useTextareaStore = createSelectors(useTextareaStoreBase)

const routerLLMService = rendererContainer.get<LLMService>(
  RouterLLMServiceToken,
)

export function useCurrentLan(): Language | null {
  const rawLanguage = useTextareaStore.use.rawLanguage()
  const detectedRawLanguage = useTextareaStore.use.detectedRawLanguage()
  return rawLanguage ?? detectedRawLanguage
}

export namespace TextareaActions {
  export async function callLLM() {
    useTextareaStore.setState({
      changing: false,
    })
    const state = useTextareaStore.getState()
    const { raw, currentTab, selectedLLMProvider } = state
    if (!raw) return

    let stream: IterableReadableStream<string>
    switch (currentTab) {
      case Tab.trans:
        stream = await routerLLMService.textAreaEnToCn(raw, {
          provider: selectedLLMProvider,
        })
        break
      case Tab.rewrite:
        stream = await routerLLMService.writeSuggestion(raw, {
          provider: selectedLLMProvider,
        })
        break
    }

    let version = 0
    useTextareaStore.setState((state) => {
      version = ++state.resultMap.versions[currentTab]
      state.resultMap[currentTab] = {
        input: raw,
        output: '',
        provider: selectedLLMProvider!!,
      }
    })

    for await (const chunk of stream) {
      useTextareaStore.setState((state) => {
        if (state.resultMap.versions[currentTab] != version) return
        state.resultMap[currentTab]!!.output += chunk
      })
    }
  }

  // async function mockCallLLM() {
  //   useTextareaStore.setState({
  //     changing: false,
  //   })
  //   const { raw, currentTab } = useTextareaStore.getState()
  //   if (!raw.trim()) return
  //   const stream = mockStream(raw)
  //
  //   let firstChunk = true
  //   for await (const chunk of stream) {
  //     const { generating } = useTextareaStore.getState()
  //     if (generating || firstChunk) {
  //       appendText(chunk, currentTab, firstChunk)
  //     }
  //     firstChunk = false
  //   }
  //   useTextareaStore.setState({
  //     generating: false,
  //   })
  // }

  function detectLanguage(rawText: string) {
    const lan = detect(rawText)
    useTextareaStore.setState({
      detectedRawLanguage: lan,
    })
  }

  export const debouncedCallLLM = debounce(callLLM, 1000)
  // const debouncedMockCallLLM = debounce(mockCallLLM, 1000)
  const debouncedDetectLanguage = debounce(detectLanguage, 1000)

  export function changeRawText(rawText: string) {
    useTextareaStore.setState((state) => ({
      raw: rawText,
      changing: true,
      resultMap: {
        versions: {
          [Tab.trans]: state.resultMap.versions[Tab.trans] + 1,
          [Tab.rewrite]: state.resultMap.versions[Tab.rewrite] + 1,
        },
        [Tab.trans]: null,
        [Tab.rewrite]: null,
      },
    }))

    const mock = useTextareaStore.getState().mock
    if (mock) {
      // debouncedMockCallLLM()
    } else {
      debouncedCallLLM()
    }
    debouncedDetectLanguage(rawText)
  }

  export function changeTab(tab: Tab) {
    const state = useTextareaStore.getState()
    useTextareaStore.setState({
      currentTab: tab,
    })
    if (!state.resultMap[tab]) callLLM().then()
  }

  export function changeProvider(provider: LLMProvider.Constant) {
    useTextareaStore.setState({
      selectedLLMProvider: provider,
    })
    callLLM().then()
  }

  export async function setLLMAvailable() {
    const available = await Promise.all(
      LLMProvider.values().map((e) => {
        return routerLLMService.getAvailable({
          provider: e.name as LLMProvider.Constant,
        })
      }),
    )

    let availableLLMProviders = LLMProvider.values()
      .map((e) => e.name)
      .filter((e, i) => {
        return available[i]
      })

    useTextareaStore.setState((state) => ({
      availableLLMProviders,
      selectedLLMProvider:
        state.selectedLLMProvider ?? availableLLMProviders.length
          ? availableLLMProviders[0]
          : null,
    }))
  }
}
