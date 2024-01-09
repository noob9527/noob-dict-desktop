import { type ISearchHistory } from '../../model/history';
import { Page } from '../../model/page';

// used in renderer process
export const DexieHistoryServiceToken = Symbol.for('dexie-history-service');

// used in renderer process
export const LocalHistoryServiceToken = Symbol.for('local-history-service');

// used in main process
export const MainHistoryServiceToken = Symbol.for('main-history-service');


interface HistorySearchParam {
  user_id: string
}

export interface HistoryParam extends HistorySearchParam {
  textLike?: string | null
  sourceLike?: string | null
  page: number
  size: number
}

export interface HistoryCreateAtSearchParam extends HistorySearchParam {
  createAtBetween: {
    lowerBound: number,
    upperBound?: number,
  }
}

export interface HistoryUpdateAtSearchParam extends HistorySearchParam {
  updateAtBetween: {
    lowerBound: number,
    upperBound?: number,
  }
}

export interface HistoryService {
  /**
   * add history item to db
   * @param history
   */
  add(history: ISearchHistory): Promise<ISearchHistory>

  /**
   * update history item in db
   * auto update its update_at property
   * @param history
   */
  update(history: ISearchHistory): Promise<ISearchHistory>

  /**
   * find history items by text
   * @param text
   * @param user_id
   */
  findAll(text: string, user_id: string): Promise<ISearchHistory[]>

  list(param: HistoryParam): Promise<Page<ISearchHistory>>

  searchByCreateAt(param: HistoryCreateAtSearchParam): Promise<ISearchHistory[]>

  searchByUpdateAt(param: HistoryUpdateAtSearchParam): Promise<ISearchHistory[]>

  fetchSourceSuggest(text: string, user_id: string): Promise<string[]>

  // remove all
}
