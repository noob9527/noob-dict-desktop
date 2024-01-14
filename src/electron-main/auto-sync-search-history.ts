import { syncWindowManager } from './window/sync-window'
import globalState from './global-state'
import { ipcMain } from 'electron-better-ipc'
import { SyncHistoryChannel } from '../electron-shared/ipc/ipc-channel-sync-history'
import { homeWindowManager } from './window/home-window'
import logger from '../electron-shared/logger'

const log = logger.getLogger('autoSyncSearchHistory')

export async function autoSyncSearchHistory(pageLimit?: number) {
  log.debug('enter autoSyncSearchHistory')
  if (syncWindowManager.isActive) {
    log.debug('No Auto Sync: Seems like the user is visiting the Sync Window')
    return
  }
  if (globalState.isSyncing) {
    log.debug('No Auto Sync: Seems like the we are in the sync progress')
    return
  }

  try {
    await ipcMain.callRenderer<{ pageLimit?: number }, void>(
      homeWindowManager.getOrCreate(),
      SyncHistoryChannel.Command.SYNC_SEARCH_HISTORY_COMMAND_START_SILENTLY,
      {
        pageLimit,
      },
    )
  } catch (e) {
    log.error(e)
  }
}
