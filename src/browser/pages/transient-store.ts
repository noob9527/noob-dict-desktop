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
import { createSelectors } from '../zustand/create-selectors'
import { WindowEvent } from '../../common/window-event'
import {
  HomeUiService,
  SearchUiServiceToken,
} from '../../common/services/home-ui-service'

const appService = rendererContainer.get<AppService>(AppServiceToken)
const ecDictSearchService = rendererContainer.get<EcDictSearchService>(
  EcDictSearchServiceToken,
)
const localDbService =
  rendererContainer.get<LocalDbService>(LocalDbServiceToken)
const searchUiService =
  rendererContainer.get<HomeUiService>(SearchUiServiceToken)

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

export function handleWindowEvent(windowId: WindowId, event: WindowEvent) {
  if (windowId !== WindowId.HOME) return
  switch (event) {
    case WindowEvent.hide:
    case WindowEvent.minimize:
      useTransientStoreBase.setState({
        isSearchWindowOpen: false,
      })
      break
    case WindowEvent.show:
    case WindowEvent.restore:
      useTransientStoreBase.setState({
        isSearchWindowOpen: true,
      })
      break
  }
}

export function showSearchWindow(focusInput?: boolean) {
  searchUiService.show()
  useTransientStoreBase.setState({
    focusInput: focusInput ?? true,
  })
}

export function hideSearchWindow() {
  searchUiService.hide()
}

export function topSearchWindow() {
  searchUiService.top()
  setFocusInput()
}

export function appHotKeyPressed() {
  const state = useTransientStoreBase.getState()
  if (state.isSearchWindowOpen) {
    if (state.focusInput) {
      // toggle
      // if search input is focused, we hide the window
      hideSearchWindow()
    } else {
      // else, we top then focus on input
      topSearchWindow()
    }
  } else {
    showSearchWindow()
  }
}

export function setFocusInput(focusInput: boolean = true) {
  useTransientStoreBase.setState({
    focusInput,
  })
}
