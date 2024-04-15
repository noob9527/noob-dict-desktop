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

const initialState: UserProfile = {
  appHotKey: '',
  readClipboard: false,
  ecDictFileLocation: null,
  dbFileLocation: null,

  'search.syncHistory.syncOnQuit': true,
  'search.syncHistory.syncOnStart': true,
  'search.syncHistory.syncIntervalMinutes': -1,
}

const settingService =
  rendererContainer.get<SettingService>(SettingServiceToken)

const useSettingStoreBase = create<UserProfile>()(
  devtools(() => initialState, {
    name: 'setting',
    enabled: Runtime.isDev,
  }),
)
export const useSettingStore = createSelectors(useSettingStoreBase)

export async function settingChange(patch: Partial<UserProfile>) {
  const oldValue = useSettingStoreBase.getState()
  const newValue = { ...oldValue, ...patch }
  logger.log('setting change', oldValue, newValue)
  return settingService.sendSettingChange(
    newValue,
    oldValue,
  )
  // we don't call settingChanged here,
  // because we will receive SETTING_CHANGED notification.
  // const actualNewValue = await settingService.sendSettingChange(
  //   newValue,
  //   oldValue,
  // )
  // settingChanged(oldValue, actualNewValue)
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
  useSettingStoreBase.setState(
    (state) => ({ ...state, ...newValue })
  )
  if (oldValue?.ecDictFileLocation != newValue.ecDictFileLocation) {
    logger.log('detect "ecDictFileLocation" updated, about to call setEcDictAvailable')
    setEcDictAvailable().then()
  }
  if (oldValue?.dbFileLocation != newValue.dbFileLocation) {
    logger.log('detect "dbFileLocation" updated, about to call setLocalDbAvailable')
    setLocalDbAvailable().then()
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
