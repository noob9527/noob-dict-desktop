import { ISearchHistory } from '../../model/history';

export const HistoryServiceToken = Symbol.for('history-service');

export interface HistorySearchParam {
  createAtBetween: {
    lowerBound: number,
    upperBound?: number,
    includeLower?: boolean,
    includeUpper?: boolean,
  }
}

export interface HistoryService {
  add(history: ISearchHistory): Promise<ISearchHistory>

  update(history: ISearchHistory): Promise<ISearchHistory>

  findAll(text: string): Promise<ISearchHistory[]>

  search(param: HistorySearchParam): Promise<ISearchHistory[]>

  // remove all
}