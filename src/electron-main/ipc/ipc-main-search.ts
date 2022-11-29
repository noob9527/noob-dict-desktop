// search channel
import { ipcMain } from 'electron-better-ipc';
import {
  getOrCreateSearchWindow,
  hideSearchWindow,
  showSearchWindow,
  toggleSearchWindow, topSearchWindow
} from '../window/search-window';
import { SearchChannel } from '../../electron-shared/ipc/ipc-channel-search';

ipcMain.answerRenderer(SearchChannel.TOGGLE_PIN_SEARCH_WINDOW, () => {
  const window = getOrCreateSearchWindow();
  const top = window.isAlwaysOnTop();
  const target = !top;
  window.setAlwaysOnTop(target);
  return target;
});

ipcMain.answerRenderer(SearchChannel.TOGGLE_SEARCH_WINDOW, async () => {
  return toggleSearchWindow();
});

ipcMain.answerRenderer(SearchChannel.SHOW_SEARCH_WINDOW, async () => {
  return showSearchWindow();
});

ipcMain.answerRenderer(SearchChannel.HIDE_SEARCH_WINDOW, async () => {
  return hideSearchWindow();
});

ipcMain.answerRenderer(SearchChannel.TOP_SEARCH_WINDOW, async () => {
  return topSearchWindow();
});

ipcMain.answerRenderer(SearchChannel.SEARCH, async (data: any) => {
  const window = getOrCreateSearchWindow();
  await showSearchWindow();
  if (data.text) {
    await ipcMain.callRenderer(window, SearchChannel.SEARCH, { text: data.text });
  }
});

