// popup channel
import { ipcMain } from 'electron-better-ipc';
import logger from '../../electron-shared/logger';
import { hidePopupWindow, showPopupWindow } from '../window/popup-window';
import { PopupChannel } from '../../electron-shared/ipc/ipc-channel-popup';

ipcMain.answerRenderer(PopupChannel.SHOW_POPUP_WINDOW, () => {
  logger.log(PopupChannel.SHOW_POPUP_WINDOW);
  showPopupWindow();
});

ipcMain.answerRenderer(PopupChannel.HIDE_POPUP_WINDOW, () => {
  logger.log(PopupChannel.HIDE_POPUP_WINDOW);
  hidePopupWindow();
});
