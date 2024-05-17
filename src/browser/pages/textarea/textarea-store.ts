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
import { Workflow } from '../../../common/services/llm/workflow'
import { SettingActions, useSettingStore } from '../setting/setting-store'

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

  selectedLLMProvider: LLMProvider.Constant | null

  changing: boolean
  mock: boolean
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
  import getPrompt = SettingActions.getPrompt

  export function getDeterminedLan() {
    const { rawLanguage, detectedRawLanguage } = useTextareaStore.getState()
    return rawLanguage ?? detectedRawLanguage
  }

  export async function callLLM() {
    useTextareaStore.setState({
      changing: false,
    })
    const state = useTextareaStore.getState()
    const { raw, currentTab, selectedLLMProvider } = state
    if (!raw) return

    detectLanguage(raw) // call detect lan immediately
    const lan = getDeterminedLan()

    let prompt: string
    switch (currentTab) {
      case Tab.trans:
        switch (lan) {
          case 'EN':
            prompt = getPrompt(Workflow.trans_text_en_to_cn)
            break
          case 'ZH':
            prompt = getPrompt(Workflow.trans_text_to_en)
            break
          case 'JP':
            prompt = getPrompt(Workflow.trans_text_to_en)
            break
          default:
            throw new Error(`unsupported language ${lan}`)
        }
        break
      case Tab.rewrite:
        prompt = getPrompt(Workflow.rewrite_text_en)
        break
    }
    const stream: IterableReadableStream<string> =
      await routerLLMService.stream({ text: raw }, prompt, {
        provider: selectedLLMProvider,
      })

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
  const debouncedDetectLanguage = debounce(detectLanguage, 500)

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

    // we need to first detect the lan
    debouncedDetectLanguage(rawText)
    const mock = useTextareaStore.getState().mock
    if (mock) {
      // debouncedMockCallLLM()
    } else {
      debouncedCallLLM()
    }
  }

  export function changeTab(tab: Tab) {
    const state = useTextareaStore.getState()
    useTextareaStore.setState({
      currentTab: tab,
    })
    if (!state.resultMap[tab]) callLLM().then()
  }

  export function changeProvider(
    provider: LLMProvider.Constant,
    regenerate: boolean,
  ) {
    useTextareaStore.setState({
      selectedLLMProvider: provider,
    })
    if (regenerate) {
      callLLM().then()
    }
  }
}
