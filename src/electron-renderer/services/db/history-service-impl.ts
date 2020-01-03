import { HistoryService } from '../../../common/services/db/history-service';
import { IHistory } from '../../../common/model/history';
import database from './database';
import { injectable } from 'inversify';

@injectable()
export class DexieHistoryService implements HistoryService {
  async findAll(text: string): Promise<IHistory[]> {
    return database.histories.where('text').equals(text).toArray()
  }

  async save(history: IHistory): Promise<IHistory> {
    history.id = await database.histories.add(history);
    return history;
  }
}