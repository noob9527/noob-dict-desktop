import { ipcMain } from 'electron-better-ipc';
import { getOrCreateSettingWindow } from './window/setting-window';
import { PopupChannel, SearchChannel, SettingChannel } from '../common/ipc-channel';
import { getOrCreateSearchWindow, showSearchWindow, toggleSearchWindow } from './window/search-window';
import { showPopupWindow } from './window/popup-window';
import logger from '../common/utils/logger';
import { handleSettingChange } from './setting';
import { UserProfile } from '../common/model/user-profile';

ipcMain.answerRenderer(SettingChannel.OPEN_SETTING_WINDOW, () => {
  getOrCreateSettingWindow();
  return true;
});

ipcMain.answerRenderer(SettingChannel.SETTING_CHANGE, async data => {
  const { newValue, oldValue } = data as { newValue: UserProfile, oldValue: UserProfile };
  return handleSettingChange(newValue, oldValue);
});

ipcMain.answerRenderer(SearchChannel.TOGGLE_PIN_SEARCH_WINDOW, () => {
  const window = getOrCreateSearchWindow();
  const top = window.isAlwaysOnTop();
  const target = !top;
  window.setAlwaysOnTop(target);
  return target;
});

ipcMain.answerRenderer(SearchChannel.TOGGLE_SEARCH_WINDOW, async (data: any) => {
  return toggleSearchWindow(data);
  // showSearchWindow();
});

ipcMain.answerRenderer(SearchChannel.SHOW_SEARCH_WINDOW, async (data: any) => {
  return showSearchWindow();
});

ipcMain.answerRenderer(PopupChannel.SHOW_POPUP_WINDOW, () => {
  logger.log(PopupChannel.SHOW_POPUP_WINDOW);
  showPopupWindow();
});