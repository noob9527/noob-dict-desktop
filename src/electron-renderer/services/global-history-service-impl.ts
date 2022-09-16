import {
  GlobalHistoryService,
} from '../../common/services/global-history-service';
import { injectable } from 'inversify';
import { HistoryService, HistoryServiceToken } from '../../common/services/db/history-service';
import { rendererContainer } from '../../common/container/renderer-container';
import { NoteService, NoteServiceToken } from '../../common/services/db/note-service';
import logger from '../../electron-shared/logger';
import { UserService, UserServiceToken } from '../../common/services/user-service';
import axios from 'axios';
import { APP_CONSTANTS } from '../../common/app-constants';
import { ISearchHistory, SearchHistory } from '../../common/model/history';

interface SyncHistoriesRequest {
  clientLastSyncTime: number
  itemSinceLastSync: ISearchHistory[]
}

interface SyncHistoriesResponse {
  serverLastSyncTime: number
  itemSinceLastSync: ISearchHistory[]
}

@injectable()
export class GlobalHistoryServiceImpl implements GlobalHistoryService {
  private historyService: HistoryService;
  private noteService: NoteService;
  private userService: UserService;
  private log = logger.getLogger('GlobalHistoryServiceImpl');

  constructor() {
    this.historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);
    this.noteService = rendererContainer.get<NoteService>(NoteServiceToken);
    this.userService = rendererContainer.get<UserService>(UserServiceToken);
  }

  async syncHistories() {
    const methodLogger = this.log.getLogger('syncHistories');
    methodLogger.debug('start sync histories');

    const currentUser = await this.userService.fetchCurrentUserFromStorage();
    if (!currentUser) {
      methodLogger.debug('sync terminated as no logged in user');
      return;
    }
    // select histories where update time greater than last_sync_time
    const lastSyncTime = this.getLastSyncTime();
    const histories = await this.historyService.searchByUpdateAt({
      user_id: currentUser.id,
      updateAtBetween: {
        lowerBound: lastSyncTime.valueOf(),
      }
    });

    methodLogger.debug('send item size', histories.length);
    const res = await this.sync2server({
      clientLastSyncTime: lastSyncTime.valueOf(),
      itemSinceLastSync: histories,
    });
    methodLogger.debug('receive item size', res.itemSinceLastSync.length);

    // const promises = res.itemSinceLastSync.map(history => {
    //   return this.noteService.syncHistory(history);
    // });
    // await Promise.all(promises);

    // for now, we have to process it one by one
    // otherwise we may encounter concurrent related issue
    // e.g. Error: "Key already exists in the object store."
    for (const history of res.itemSinceLastSync) {
      await this.noteService.syncHistory(history);
    }

    // update last sync time
    this.updateLastSyncTime(new Date(res.serverLastSyncTime));

    methodLogger.debug('end sync histories');
  }

  /**
   * doesn't support, fall back to sync histories.
   * @param pageSize
   * @param pageLimit
   */
  syncHistoryPages(pageSize: number, pageLimit: number) {
    this.syncHistories();
  }

  async sync2server(request: SyncHistoriesRequest): Promise<SyncHistoriesResponse> {
    const res = await axios.patch(`${APP_CONSTANTS.API_PREFIX}/histories`, request);
    const data = res.data as SyncHistoriesResponse;
    // wrap history
    data.itemSinceLastSync = data.itemSinceLastSync.map(e => SearchHistory.wrap(e));
    return data;
  }

  getLastSyncTime(): Date {
    const user = this.userService.fetchCurrentUserFromStorage();
    return new Date(user!!.last_sync_time);
  }

  updateLastSyncTime(date: Date) {
    this.userService.patchCurrentUser({
      last_sync_time: date.toISOString(),
    });
  }

}
