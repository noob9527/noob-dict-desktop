import { HistorySearchParam, HistoryService } from '../../../common/services/db/history-service';
import { ISearchHistory, SearchHistory } from '../../../common/model/history';
import database from './database';
import { injectable } from 'inversify';

@injectable()
export class DexieHistoryService implements HistoryService {
  async findAll(text: string): Promise<ISearchHistory[]> {
    const res = await database.histories
      .where('text').equals(text).toArray();
    return res.map(e => SearchHistory.wrap(e));
  }

  async search(param: HistorySearchParam): Promise<ISearchHistory[]> {
    const res = await database.histories
      .where('createAt')
      .between(
        param.createAtBetween.lowerBound,
        param.createAtBetween.upperBound ?? (new Date()).getTime(),
        param.createAtBetween.includeLower ?? true,
        param.createAtBetween.includeUpper ?? true,
      )
      .toArray();
    return res.map(e => SearchHistory.wrap(e));
  }

  async add(history: ISearchHistory): Promise<ISearchHistory> {
    history.id = await database.histories.add(history);
    return history;
  }

  async update(history: ISearchHistory): Promise<ISearchHistory> {
    await database.histories.update(history.id!!, history);
    return history;
  }

}