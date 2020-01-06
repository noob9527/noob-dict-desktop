import { HistoryService } from '../../../common/services/db/history-service';
import { SearchHistory, ISearchHistory } from '../../../common/model/history';
import database from './database';
import { injectable } from 'inversify';

@injectable()
export class DexieHistoryService implements HistoryService {
  async findAll(text: string): Promise<ISearchHistory[]> {
    const res = await database.histories
      .where('text').equals(text).toArray();
    return res.map(e => new SearchHistory(e));
  }

  async save(history: ISearchHistory): Promise<ISearchHistory> {
    history.id = await database.histories.add(history);
    return history;
  }
}