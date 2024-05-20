import { UserProfile } from '../../../electron-shared/user-profile/user-profile'
import { create } from 'zustand'
import { rendererContainer } from '../../../common/container/renderer-container'
import {
  SettingService,
  SettingServiceToken,
} from '../../../common/services/setting-service'
import logger from '../../../electron-shared/logger'
import { setEcDictAvailable, setLocalDbAvailable } from '../transient-store'
import { createSelectors } from '../../zustand/create-selectors'
import { devtools } from 'zustand/middleware'
import { Runtime } from '../../../electron-shared/runtime'
import { debounce, isEqual, pick } from 'lodash'
import { Workflow } from '../../../common/services/llm/workflow'
import { defaultPromptTpls } from '../../../common/services/llm/prompts/prompts'
import { LLMProvider } from '../../../common/services/llm/provider'
import {
  LLMInitOption,
  LLMService,
  RouterLLMServiceToken,
} from '../../../common/services/llm/llm-service';
import { immer } from 'zustand/middleware/immer'
import { WritableDraft } from 'immer';
import {
  geminiSettingToOption,
  ollamaSettingToOption,
  openAISettingToOption
} from '../../../common/services/llm/utils';

interface SettingState extends UserProfile {
  persisted: UserProfile
  isChanging: boolean
  availableLLMProviders: LLMProvider.Constant[]
}

const initData: UserProfile = {
  appHotKey: '',
  readClipboard: false,
  ecDictFileLocation: null,
  dbFileLocation: null,

  'search.syncHistory.syncOnQuit': true,
  'search.syncHistory.syncOnStart': true,
  'search.syncHistory.syncIntervalMinutes': -1,

  llm: {
    providers: {
      open_ai: {
        base_url: null,
        api_key: null,
        model_name: null,
      },
      gemini: {
        api_key: null,
      },
      ollama: {
        base_url: null,
        model_name: null,
      },
    },
    prompts: {
      trans_word_en_to_cn: null,
      trans_text_to_en: null,
      trans_text_en_to_cn: null,
      rewrite_text_en: null,
      quiz_singular_choice: null,
    },
  },
}

const initialState: SettingState = {
  // we use this prop to store the config.json data
  persisted: initData,
  isChanging: false,
  availableLLMProviders: [],
  ...initData,
}

const userProfileKeys = Object.keys(initData) as Array<keyof UserProfile>

function stateToProfile(state: UserProfile): UserProfile {
  return pick(state, userProfileKeys)
}

const settingService =
  rendererContainer.get<SettingService>(SettingServiceToken)

const useSettingStoreBase = create<SettingState>()(
  devtools(
    immer(() => initialState),
    {
      name: 'setting',
      enabled: Runtime.isDev,
    },
  ),
)
export const useSettingStore = createSelectors(useSettingStoreBase)

const sendSettingChange = (oldValue: UserProfile, newValue: UserProfile) => {
  const newProfile = stateToProfile(newValue)
  return settingService.sendSettingChange(newProfile, oldValue)
  // we don't call settingChanged here,
  // because we will receive SETTING_CHANGED notification.
  // const actualNewValue = await settingService.sendSettingChange(
  //   newValue,
  //   oldValue,
  // )
  // settingChanged(oldValue, actualNewValue)
}

const debouncedSendSettingChange = debounce(
  sendSettingChange,
  1000,
)

export async function debounceSettingChange(patch: Partial<UserProfile>) {
  const oldValue = useSettingStoreBase.getState()
  const newValue = {
    ...oldValue,
    ...patch,
    isChanging: true,
  }
  useSettingStoreBase.setState((_) => newValue)
  logger.log('debounce setting change', oldValue, newValue)
  return debouncedSendSettingChange(oldValue, newValue)
}

export async function debounceSettingChange2(mutation: (draft: WritableDraft<UserProfile>) => (void)) {
  const oldValue = useSettingStore.getState()
  useSettingStore.setState(mutation)
  const newValue = useSettingStore.getState()
  logger.log('debounce setting change2', oldValue, newValue)
  return debouncedSendSettingChange(oldValue, newValue)
}

/**
 * will be called when renderer receive
 * SettingChannel.SETTING_CHANGE event.
 *
 * @param oldValue
 * @param newValue
 */
export function settingChanged(
  oldValue: UserProfile | null,
  newValue: UserProfile,
) {
  useSettingStoreBase.setState((state) => ({
    ...state,
    ...newValue,
    persisted: newValue,
    isChanging: false,
  }))
  logger.log('setting changed', oldValue, newValue)

  // tmp fix:
  // current change any code will trigger settingChanged
  if (!Runtime.isDev) {
    if (oldValue?.ecDictFileLocation != newValue.ecDictFileLocation) {
      logger.log(
        'detect "ecDictFileLocation" updated, about to call setEcDictAvailable',
        oldValue?.ecDictFileLocation,
        newValue.ecDictFileLocation,
      )
      setEcDictAvailable().then()
    }
    if (oldValue?.dbFileLocation != newValue.dbFileLocation) {
      logger.log(
        'detect "dbFileLocation" updated, about to call setLocalDbAvailable',
        oldValue?.ecDictFileLocation,
        newValue.ecDictFileLocation,
      )
      setLocalDbAvailable().then()
    }
  }

  if (!isEqual(oldValue?.llm?.providers, newValue.llm?.providers)) {
    SettingActions.setLLMAvailable().then()
  }
}

const log = logger.getLogger('SettingActions')

export namespace SettingActions {
  export async function init() {
    const setting = await settingService.initSetting()
    log.log('init', setting)
    settingChanged(null, setting)
  }

  export function getPrompt(workflow: Workflow): string {
    const state = useSettingStore.getState()
    return state.llm.prompts?.[workflow] ?? defaultPromptTpls[workflow]
  }

  const routerLLMService = rendererContainer.get<LLMService>(
    RouterLLMServiceToken,
  )

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
      }) as LLMProvider.Constant[]

    useSettingStore.setState({
      availableLLMProviders,
    })
  }

  export function getLLMInitOption(provider: LLMProvider.Constant) {
    const state = useSettingStore.getState()
    if(!state.availableLLMProviders.includes(provider)) {
      return null
    }

    const llmProvider = LLMProvider.of(provider)
    if (!llmProvider.settingKey) return null

    const setting = state.llm.providers[llmProvider.settingKey]
    let option: LLMInitOption | null = null
    switch (provider) {
      case LLMProvider.Constant.GEMINI:
        option = geminiSettingToOption(setting)
        break
      case LLMProvider.Constant.OPEN_AI:
        option = openAISettingToOption(setting)
        break
      case LLMProvider.Constant.OLLAMA:
        option = ollamaSettingToOption(setting)
        break
      case LLMProvider.Constant.FAKE:
        option = {
          provider
        }
        break
      default:
        return null
    }
    return option
  }

  export async function persistChange() {
    const oldValue = useSettingStore.getState().persisted
    const newValue = useSettingStore.getState()
    logger.log('persist change', oldValue, newValue)
    return sendSettingChange(oldValue, newValue)
  }

  export async function cancelChange() {
    const oldValue = useSettingStore.getState().persisted
    useSettingStore.setState(state => {
      Object.assign(state, oldValue)
      state.persisted = oldValue
    })
  }

}
