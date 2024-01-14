import './ipc-main-ecdict'
import './ipc-main-home'
import './ipc-main-setting'
import './ipc-main-local-db'
import './ipc-main-window'
import './ipc-main-sync-history'
import { ipcMain } from 'electron-better-ipc'
import { getClientAppId } from '../utils/env-util'
import { AppChannel } from '../../electron-shared/ipc/ipc-channel-app'

ipcMain.answerRenderer(AppChannel.GET_CLIENT_APP_ID, () => {
  return getClientAppId()
})
