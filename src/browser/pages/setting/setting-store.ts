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
import { TextareaActions } from '../textarea/textarea-store'
import setLLMAvailable = TextareaActions.setLLMAvailable

interface SettingState extends UserProfile {
  persisted: UserProfile
  isChanging: boolean
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
    }
  },
}

const initialState: SettingState = {
  persisted: initData,
  isChanging: false,
  ...initData,
}

const userProfileKeys = Object.keys(initData) as Array<keyof UserProfile>

function stateToProfile(state: UserProfile): UserProfile {
  return pick(state, userProfileKeys)
}

const settingService =
  rendererContainer.get<SettingService>(SettingServiceToken)

const useSettingStoreBase = create<SettingState>()(
  devtools(() => initialState, {
    name: 'setting',
    enabled: Runtime.isDev,
  }),
)
export const useSettingStore = createSelectors(useSettingStoreBase)

const debouncedSendSettingChange = debounce(
  (oldValue: UserProfile, newValue: UserProfile) => {
    const newProfile = stateToProfile(newValue)
    return settingService.sendSettingChange(newProfile, oldValue)
    // we don't call settingChanged here,
    // because we will receive SETTING_CHANGED notification.
    // const actualNewValue = await settingService.sendSettingChange(
    //   newValue,
    //   oldValue,
    // )
    // settingChanged(oldValue, actualNewValue)
  },
  1000,
)

export async function settingChange(patch: Partial<UserProfile>) {
  const oldValue = useSettingStoreBase.getState()
  const newValue = {
    ...oldValue,
    ...patch,
    isChanging: true,
  }
  useSettingStoreBase.setState((_) => newValue)
  logger.log('setting change', oldValue, newValue)
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

  if (!isEqual(oldValue?.llm, newValue.llm)) {
    setLLMAvailable().then()
  }
}

const log = logger.getLogger('SettingActions')

export const SettingActions = {
  async init() {
    const setting = await settingService.initSetting()
    log.log('init', setting)
    settingChanged(null, setting)
  },
}
