import { ISearchHistory } from '../../model/history';

export const HistoryServiceToken = Symbol.for('history-service');

export interface HistoryService {
  add(history: ISearchHistory): Promise<ISearchHistory>

  update(history: ISearchHistory): Promise<ISearchHistory>

  findAll(text: string): Promise<ISearchHistory[]>

  // remove all
}