import { ipcMain } from 'electron-better-ipc'
import { SyncHistoryChannel } from '../../electron-shared/ipc/ipc-channel-sync-history'
import globalState from '../global-state';
import logger from '../../electron-shared/logger';

ipcMain.answerRenderer(
  SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_STARTED,
  () => {
    globalState.isSyncing = true
  },
)
ipcMain.answerRenderer(
  SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_FINISHED,
  () => {
    globalState.isSyncing = false
  },
)
ipcMain.answerRenderer(
  SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_ERROR,
  (data: any) => {
    logger.error(data.error)
    globalState.isSyncing = false
  },
)
ipcMain.answerRenderer(
  SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_PROGRESS,
  (data: any) => {
    // do nothing
  },
)
