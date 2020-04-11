import { ISearchHistory } from '../model/history';

export const GlobalHistoryServiceToken = Symbol.for('global-history-service');

export interface SyncHistoriesRequest {
  clientLastSyncTime: number
  itemSinceLastSync: ISearchHistory[]
}

export interface SyncHistoriesResponse {
  serverLastSyncTime: number
  itemSinceLastSync: ISearchHistory[]
}

export interface GlobalHistoryService {
  /**
   * sync local histories with global server
   */
  syncHistories()

  sync2server(request: SyncHistoriesRequest): Promise<SyncHistoriesResponse>

  updateLastSyncTime(date: Date)
  getLastSyncTime(): Date
}
