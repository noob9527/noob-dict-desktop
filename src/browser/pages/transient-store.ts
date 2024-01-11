import { getCurrentWindowId } from '../utils/window-utils'
import { rendererContainer } from '../../common/container/renderer-container'
import { AppService, AppServiceToken } from '../../common/services/app-service'
import { create } from 'zustand'
import { UserProfile } from '../../electron-shared/user-profile/user-profile'
import { WindowId } from '../../common/window-id'
import { EcDictSearchService } from '../../electron-renderer/services/ecdict-search-service'
import { EcDictSearchServiceToken } from '../../common/services/search-service'
import {
  LocalDbService,
  LocalDbServiceToken,
} from '../../common/services/db/local-db-service'
import { call } from '@redux-saga/core/effects'
import { createSelectors } from '../zustand/create-selectors';

const appService = rendererContainer.get<AppService>(AppServiceToken)
const ecDictSearchService = rendererContainer.get<EcDictSearchService>(
  EcDictSearchServiceToken
)
const localDbService =
  rendererContainer.get<LocalDbService>(LocalDbServiceToken)

interface TransientState {
  focusInput: boolean
  isSearchWindowOpen: boolean
  windowIdentifier: WindowId
  ecDictAvailable: boolean
  localDbAvailable: boolean
}

const initialState: TransientState = {
  focusInput: false,
  isSearchWindowOpen: !appService.getProcess().argv.includes('--background'),
  windowIdentifier: getCurrentWindowId(),
  ecDictAvailable: false,
  localDbAvailable: false,
}

const useTransientStoreBase = create<TransientState>()(() => initialState)
export const useTransientStore = createSelectors(useTransientStoreBase)

export async function setEcDictAvailable() {
  const available = await ecDictSearchService.fetchAvailable()
  useTransientStoreBase.setState({
    ecDictAvailable: available,
  })
}
export async function setLocalDbAvailable() {
  const available = await localDbService.fetchAvailable()
  useTransientStoreBase.setState({
    localDbAvailable: available,
  })
}
