import { IHistory } from '../../../browser/db/history';

export const HistoryServiceToken = Symbol.for('history-service');

export interface HistoryService {
  save(history: IHistory): Promise<IHistory>

  findAll(text: string): Promise<IHistory[]>
  // remove all
}