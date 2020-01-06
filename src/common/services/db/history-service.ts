import { ISearchHistory } from '../../model/history';

export const HistoryServiceToken = Symbol.for('history-service');

export interface HistoryService {
  save(history: ISearchHistory): Promise<ISearchHistory>

  findAll(text: string): Promise<ISearchHistory[]>
  // remove all
}