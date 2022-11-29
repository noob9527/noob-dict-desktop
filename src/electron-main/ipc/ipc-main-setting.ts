// setting channel
import { ipcMain } from 'electron-better-ipc';
import { getOrCreateSettingWindow } from '../window/setting-window';
import { UserProfile } from '../../electron-shared/user-profile/user-profile';
import logger from '../../electron-shared/logger';
import { handleSettingChange } from '../setting';
import { SettingChannel } from '../../electron-shared/ipc/ipc-channel-setting';

ipcMain.answerRenderer(SettingChannel.OPEN_SETTING_WINDOW, () => {
  getOrCreateSettingWindow();
  return true;
});

ipcMain.answerRenderer(SettingChannel.SETTING_CHANGE, async data => {
  const { newValue, oldValue } = data as { newValue: UserProfile, oldValue: UserProfile };
  logger.log('setting change', newValue);
  return handleSettingChange(newValue, oldValue);
});

