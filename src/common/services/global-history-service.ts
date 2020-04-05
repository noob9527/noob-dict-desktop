export const GlobalHistoryServiceToken = Symbol.for('global-history-service');

export interface GlobalHistoryService {
  /**
   * sync local histories with global server
   */
  syncHistories()
}