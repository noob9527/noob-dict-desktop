import { ipcMain } from 'electron-better-ipc';
import { getOrCreateSettingWindow } from './window/setting-window';
import { SearchChannel, SettingChannel } from '../common/ipc-channel';
import { getOrCreateSearchWindow } from './window/search-window';

ipcMain.answerRenderer(SettingChannel.OPEN_SETTING_WINDOW, () => {
  getOrCreateSettingWindow();
  return true;
});

ipcMain.answerRenderer(SearchChannel.TOGGLE_PIN_SEARCH_WINDOW, () => {
  const window = getOrCreateSearchWindow();
  const top = window.isAlwaysOnTop();
  const target = !top;
  window.setAlwaysOnTop(target);
  return target;
});