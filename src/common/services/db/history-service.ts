import { ISearchHistory } from '../../model/history';

export const HistoryServiceToken = Symbol.for('history-service');

export interface HistorySearchParam {
  user_id: string
  createAtBetween: {
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
   * @param history
   */
  update(history: ISearchHistory): Promise<ISearchHistory>

  /**
   * find history items by text
   * @param text
   * @param user_id
   */
  findAll(text: string, user_id: string): Promise<ISearchHistory[]>

  /**
   * find history items by param
   * @param param
   */
  search(param: HistorySearchParam): Promise<ISearchHistory[]>

  // remove all
}