import {
  type HistoryCreateAtSearchParam,
  type HistoryParam,
  type HistoryUpdateAtSearchParam,
  HistoryService,
} from '../../../../common/services/db/history-service';
import { type ISearchHistory } from '../../../../common/model/history';
import { injectable } from 'inversify';
import { Page } from '../../../../common/model/page';
import { ipcCallMain } from '../../../utils/ipc-decorator';
import { LOCAL_DB_HISTORY_PREFIX } from '../../../../electron-shared/ipc/ipc-channel-local-db';

@injectable()
export class SqliteHistoryService implements HistoryService {
  @ipcCallMain(LOCAL_DB_HISTORY_PREFIX)
  add(history: ISearchHistory): Promise<ISearchHistory> {
    return Promise.resolve({} as ISearchHistory);
  }

  @ipcCallMain(LOCAL_DB_HISTORY_PREFIX)
  fetchSourceSuggest(text: string, user_id: string): Promise<string[]> {
    return Promise.resolve([]);
  }

  @ipcCallMain(LOCAL_DB_HISTORY_PREFIX)
  findAll(text: string, user_id: string): Promise<ISearchHistory[]> {
    return Promise.resolve({} as any);
  }

  @ipcCallMain(LOCAL_DB_HISTORY_PREFIX)
  list(param: HistoryParam): Promise<Page<ISearchHistory>> {
    return Promise.resolve({} as any);
  }

  @ipcCallMain(LOCAL_DB_HISTORY_PREFIX)
  searchByCreateAt(param: HistoryCreateAtSearchParam): Promise<ISearchHistory[]> {
    return Promise.resolve({} as any);
  }

  @ipcCallMain(LOCAL_DB_HISTORY_PREFIX)
  searchByUpdateAt(param: HistoryUpdateAtSearchParam): Promise<ISearchHistory[]> {
    return Promise.resolve({} as any);
  }

  @ipcCallMain(LOCAL_DB_HISTORY_PREFIX)
  update(history: ISearchHistory): Promise<ISearchHistory> {
    return Promise.resolve({} as any);
  }

}
