import './ipc-main-ecdict';
import './ipc-main-login';
import './ipc-main-popup';
import './ipc-main-search';
import './ipc-main-setting';
import './ipc-main-local-db';
import { ipcMain } from 'electron-better-ipc';
import { getClientAppId } from '../utils/env-util';
import { AppChannel } from '../../electron-shared/ipc/ipc-channel-app';


ipcMain.answerRenderer(AppChannel.GET_CLIENT_APP_ID, () => {
  return getClientAppId();
});