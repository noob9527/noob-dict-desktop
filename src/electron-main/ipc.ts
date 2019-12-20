import { ipcMain } from 'electron-better-ipc';
import { getOrCreateSettingWindow } from './window/setting-window';
import { PopupChannel, SearchChannel, SettingChannel } from '../common/ipc-channel';
import { getOrCreateSearchWindow, showSearchWindow } from './window/search-window';
import { showPopupWindow } from './window/popup-window';
import logger from '../common/utils/logger';

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

ipcMain.answerRenderer(SearchChannel.SHOW_SEARCH_WINDOW, () => {
  showSearchWindow();
});

ipcMain.answerRenderer(PopupChannel.SHOW_POPUP_WINDOW, () => {
  logger.log(PopupChannel.SHOW_POPUP_WINDOW);
  showPopupWindow();
});