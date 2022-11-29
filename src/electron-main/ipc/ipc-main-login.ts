// login channel
import { ipcMain } from 'electron-better-ipc';
import { getOrCreateLoginWindow } from '../window/login-window';
import { LoginChannel } from '../../electron-shared/ipc/ipc-channel-login';

ipcMain.answerRenderer(LoginChannel.SHOW_LOGIN_WINDOW, () => {
  getOrCreateLoginWindow();
  return true;
});

