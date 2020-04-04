import { ipcMain } from 'electron-better-ipc';
import { getOrCreateSettingWindow } from './window/setting-window';
import { LoginChannel, PopupChannel, SearchChannel, SettingChannel } from '../common/ipc-channel';
import {
  getOrCreateSearchWindow,
  hideSearchWindow,
  showSearchWindow,
  toggleSearchWindow
} from './window/search-window';
import { hidePopupWindow, showPopupWindow } from './window/popup-window';
import logger from '../common/utils/logger';
import { handleSettingChange } from './setting';
import { UserProfile } from '../common/model/user-profile';
import { getOrCreateLoginWindow } from './window/login-window';

// setting channel
ipcMain.answerRenderer(SettingChannel.OPEN_SETTING_WINDOW, () => {
  getOrCreateSettingWindow();
  return true;
});

ipcMain.answerRenderer(SettingChannel.SETTING_CHANGE, async data => {
  const { newValue, oldValue } = data as { newValue: UserProfile, oldValue: UserProfile };
  return handleSettingChange(newValue, oldValue);
});

// search channel
ipcMain.answerRenderer(SearchChannel.TOGGLE_PIN_SEARCH_WINDOW, () => {
  const window = getOrCreateSearchWindow();
  const top = window.isAlwaysOnTop();
  const target = !top;
  window.setAlwaysOnTop(target);
  return target;
});

ipcMain.answerRenderer(SearchChannel.TOGGLE_SEARCH_WINDOW, async (data: any) => {
  return toggleSearchWindow(data);
});

ipcMain.answerRenderer(SearchChannel.SHOW_SEARCH_WINDOW, async (data: any) => {
  return showSearchWindow(data);
});

ipcMain.answerRenderer(SearchChannel.HIDE_SEARCH_WINDOW, async (data: any) => {
  return hideSearchWindow(data);
});

ipcMain.answerRenderer(SearchChannel.SEARCH, async (data: any) => {
  const window = getOrCreateSearchWindow();
  await showSearchWindow();
  if (data.text) {
    await ipcMain.callRenderer(window, SearchChannel.SEARCH, { text: data.text })
  }
});

// popup channel
ipcMain.answerRenderer(PopupChannel.SHOW_POPUP_WINDOW, () => {
  logger.log(PopupChannel.SHOW_POPUP_WINDOW);
  showPopupWindow();
});

ipcMain.answerRenderer(PopupChannel.HIDE_POPUP_WINDOW, () => {
  logger.log(PopupChannel.HIDE_POPUP_WINDOW);
  hidePopupWindow();
});

// login channel
ipcMain.answerRenderer(LoginChannel.SHOW_LOGIN_WINDOW, () => {
  getOrCreateLoginWindow();
  return true;
});
