import {
  HistoryCreateAtSearchParam,
  HistoryParam,
  HistoryService,
  HistoryUpdateAtSearchParam,
} from '../../../../common/services/db/history-service';
import { injectable } from 'inversify';
import logger from '../../../../electron-shared/logger';
import { ISearchHistory, SearchHistory } from '../../../../common/model/history';
import { Page } from '../../../../common/model/page';

@injectable()
export class MockHistoryService implements HistoryService {
  private log = logger.getLogger(MockHistoryService.name);

  add(history: ISearchHistory): Promise<ISearchHistory> {
    this.log.log(history);
    return Promise.resolve(SearchHistory.create({}));
  }

  fetchSourceSuggest(text: string, user_id: string): Promise<string[]> {
    this.log.log(text, user_id);
    return Promise.resolve([]);
  }

  findAll(text: string, user_id: string): Promise<ISearchHistory[]> {
    this.log.log(text, user_id);
    return Promise.resolve([]);
  }

  list(param: HistoryParam): Promise<Page<ISearchHistory>> {
    this.log.log(param);
    return Promise.resolve({ totalCount: 0, items: [] });
  }

  searchByCreateAt(param: HistoryCreateAtSearchParam): Promise<ISearchHistory[]> {
    this.log.log(param);
    return Promise.resolve([]);
  }

  searchByUpdateAt(param: HistoryUpdateAtSearchParam): Promise<ISearchHistory[]> {
    this.log.log(param);
    return Promise.resolve([]);
  }

  update(history: ISearchHistory): Promise<ISearchHistory> {
    this.log.log(history);
    return Promise.resolve(SearchHistory.create({}));
  }

}
