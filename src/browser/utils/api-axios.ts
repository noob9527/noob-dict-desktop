import { AxiosInstance } from 'axios'
import { useRootStore } from '../root-store'
import logger from '../../electron-shared/logger'
import { rendererContainer } from '../../common/container/renderer-container'
import { ApiAxiosToken } from '../../common/services/api-service'

const apiAxios = rendererContainer.get<AxiosInstance>(ApiAxiosToken)

export function registerUserChangeListener() {
  useRootStore.subscribe((curr, prev) => {
    const id_token = curr.currentUser?.id_token
    if (id_token != prev.currentUser?.id_token) {
      logger.debug(
        `[registerUserChangeListener] reset id token to ${id_token?.slice(
          0,
          6,
        )}...`,
      )
      apiAxios.defaults.headers.common.tokenHeader = id_token ?? ''
    }
  })
}
