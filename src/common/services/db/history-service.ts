import { ISearchHistory } from '../../model/history';

export const HistoryServiceToken = Symbol.for('history-service');

interface HistorySearchParam {
  user_id: string
}

export interface HistoryCreateAtSearchParam extends HistorySearchParam {
  createAtBetween: {
    lowerBound: number,
    upperBound?: number,
    includeLower?: boolean,
    includeUpper?: boolean,
  }
}

export interface HistoryUpdateAtSearchParam extends HistorySearchParam {
  updateAtBetween: {
    lowerBound: number,
    upperBound?: number,
    includeLower?: boolean,
    includeUpper?: boolean,
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

  searchByCreateAt(param: HistoryCreateAtSearchParam): Promise<ISearchHistory[]>

  searchByUpdateAt(param: HistoryUpdateAtSearchParam): Promise<ISearchHistory[]>

  fetchSourceSuggest(text: string, user_id: string): Promise<string[]>

  // remove all
}