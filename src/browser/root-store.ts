import { rendererContainer } from '../common/container/renderer-container'
import { AppService, AppServiceToken } from '../common/services/app-service'
import { UserService, UserServiceToken } from '../common/services/user-service'
import {
  LoginUiService,
  LoginUiServiceToken,
} from '../common/services/login-ui-service'
import { User } from '../common/model/user'
import { dark } from './theme/dark'
import { create } from 'zustand'
import { createSelectors } from './zustand/create-selectors'
import { SettingActions } from './pages/setting/setting-store'
import logger from '../electron-shared/logger'
import { LoginOption, LoginType } from '../common/social-login'

const appService = rendererContainer.get<AppService>(AppServiceToken)
const userService = rendererContainer.get<UserService>(UserServiceToken)
const loginUiService =
  rendererContainer.get<LoginUiService>(LoginUiServiceToken)

export interface RootState {
  theme: any
  app: {
    version: String
  }
  showLoginIndicator: boolean
  currentUser: User | null | undefined
  lastEvaluatedUpdateAt: Date | null
}

const initialState: RootState = {
  theme: dark,
  app: {
    version: appService.getVersion(),
  },
  showLoginIndicator: false,
  currentUser: null,
  lastEvaluatedUpdateAt: null,
}
const useRootStoreBase = create<RootState>()(() => initialState)
export const useRootStore = createSelectors(useRootStoreBase)

export namespace RootActions {
  export async function init() {
    await reloadCurrentUserFromStorage()
    await SettingActions.init()
  }

  export async function reloadCurrentUserFromStorage() {
    loadCurrentUserFromStorage()
    await loadLastEvaluatedUpdateAt()
  }

  export function loadCurrentUserFromStorage() {
    try {
      const currentUser = userService.fetchCurrentUserFromStorage()
      useRootStoreBase.setState({
        currentUser,
      })
    } catch (e) {
      logger.error('fail to fetch currentUser', e)
    }
  }

  export async function loadLastEvaluatedUpdateAt() {
    try {
      const lastEvaluatedUpdateAt = await userService.getLastEvaluatedUpdateAt()
      useRootStoreBase.setState({
        lastEvaluatedUpdateAt,
      })
    } catch (e) {
      logger.error('fail to fetch lastEvaluatedUpdateAt', e)
    }
  }

  function loginSuccess(user: User) {
    useRootStoreBase.setState({
      currentUser: user,
      showLoginIndicator: false,
    })
  }

  function loginFailed() {
    useRootStoreBase.setState({
      showLoginIndicator: false,
    })
  }

  export function login() {
    loginUiService.show()
  }

  export function logout() {
    userService.logout()
    useRootStoreBase.setState({
      currentUser: null,
      lastEvaluatedUpdateAt: null,
    })
  }

  export async function loginCodeReceived(
    code: string,
    loginType: LoginType,
    loginOption: LoginOption,
  ) {
    useRootStoreBase.setState({
      showLoginIndicator: true,
    })
    let user
    try {
      user = await userService.login(code, loginOption)
    } catch (e) {
      logger.error('fail to fetch user info', e)
    }
    if (user) {
      loginSuccess(user)
      await loadLastEvaluatedUpdateAt()
    } else {
      loginFailed()
    }
  }
}
