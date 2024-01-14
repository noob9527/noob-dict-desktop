import { SyncHistoryChannel } from '../../electron-shared/ipc/ipc-channel-sync-history'

export const GlobalHistoryServiceToken = Symbol.for('global-history-service')

export type SyncHistoryCallback = (
  event: SyncHistoryChannel.Event,
  data?: any,
) => Promise<void> | void

export interface ProgressInfo {
  percent: number
  finishedItems: number
  totalItems: number
  finishedPages: number
  totalPages: number
  pageSize: number
}

export interface GlobalHistoryService {
  syncHistoryPages(
    pageLimit: number,
    pageSize: number,
    callback?: SyncHistoryCallback,
  )

  /**
   * indexed db to sqlite
   */
  migrateToSqlite()
}
