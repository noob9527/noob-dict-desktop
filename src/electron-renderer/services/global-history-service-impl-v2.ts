import { GlobalHistoryService, } from '../../common/services/global-history-service';
import { inject, injectable } from 'inversify';
import { HistoryService, LocalHistoryServiceToken } from '../../common/services/db/history-service';
import { rendererContainer } from '../../common/container/renderer-container';
import { NoteService, LocalNoteServiceToken } from '../../common/services/db/note-service';
import logger from '../../electron-shared/logger';
import { UserService, UserServiceToken } from '../../common/services/user-service';
import axios from 'axios';
import { APP_CONSTANTS } from '../../common/app-constants';
import { ISearchHistory, SearchHistory } from '../../common/model/history';
import { AppService, AppServiceToken } from '../../common/services/app-service';
import { User } from '../../common/model/user';

interface SyncHistoriesRequestV2 {
  clientLastSyncTime: Date
  lastEvaluatedUpdateAt: Date
  itemSinceLastSync: ISearchHistory[]
  clientAppId: string
  syncSizeLimit: number
}

interface SyncHistoriesResponseV2 {
  serverLastSyncTime: Date
  lastEvaluatedUpdateAt: Date
  items: ISearchHistory[]
  count: number
  scannedCount: number
  total: number
  syncSizeLimit: number
}

@injectable()
export class GlobalHistoryServiceImplV2 implements GlobalHistoryService {
  private historyService: HistoryService;
  private noteService: NoteService;
  private userService: UserService;
  private appService: AppService;

  private log = logger.getLogger('GlobalHistoryServiceImpl');

  constructor(
    // see https://github.com/inversify/InversifyJS/issues/1004
    // @inject(HistoryServiceToken) private historyService: HistoryService,
    // @inject(NoteServiceToken) private noteService: NoteService,
    // @inject(UserServiceToken) private userService: UserService,
    // @inject(AppServiceToken) private appService: AppService,
  ) {
    this.historyService = rendererContainer.get<HistoryService>(LocalHistoryServiceToken);
    this.noteService = rendererContainer.get<NoteService>(LocalNoteServiceToken);
    this.userService = rendererContainer.get<UserService>(UserServiceToken);
    this.appService = rendererContainer.get<AppService>(AppServiceToken);
  }

  /**
   * sync search history between server and client.
   */
  async syncHistories() {
    const methodLogger = this.log.getLogger('syncHistories');
    methodLogger.debug('start sync histories');
    await this.syncHistoryPages(1000);
    methodLogger.debug('end sync histories');
  }

  async syncHistoryPages(
    pageSize: number,
    pageLimit: number = Infinity,
  ) {
    const methodLogger = this.log.getLogger('syncHistoryPages');

    const currentUser = await this.userService.fetchCurrentUserFromStorage();
    if (!currentUser) {
      methodLogger.debug('sync terminated as no logged in user');
      return;
    }

    let response: SyncHistoriesResponseV2;
    let currentPageIndex = 0;
    let remainingItems = 0;
    do {
      const pushItemsToServer = currentPageIndex===0;
      response = await this.syncSingleHistoryPage(currentUser, pageSize, pushItemsToServer);
      remainingItems = response.total - response.count;
      let remainingPages = Math.min(Math.ceil(remainingItems / pageSize), pageLimit - currentPageIndex - 1);

      methodLogger.debug('current page index: ' + currentPageIndex);
      methodLogger.debug('remaining items: ' + remainingItems);
      methodLogger.debug('remaining pages: ' + remainingPages);
    } while (remainingItems > 0 && ++currentPageIndex < pageLimit);

    methodLogger.debug('end syncHistoryPages');
  }

  private async syncSingleHistoryPage(
    currentUser: User,
    pageSize: number,
    pushItemsToServer: boolean,
  ) {
    const methodLogger = this.log.getLogger('syncSingleHistoryPage');
    const lastEvaluatedUpdateAt = (await this.userService.getLastEvaluatedUpdateAt())
      ?? new Date(0);
    const lastSyncTime = (await this.userService.getLastSyncTime()) ?? new Date(0);

    let pushToServerItems: ISearchHistory[] = [];
    if (pushItemsToServer) {
      pushToServerItems = await this.fetchPushToServerItems(
        currentUser.id,
        new Date(currentUser.last_sync_time),
      );
      methodLogger.debug('send item size', pushToServerItems.length);
    }

    const request = {
      clientLastSyncTime: lastSyncTime,
      lastEvaluatedUpdateAt: lastEvaluatedUpdateAt,
      itemSinceLastSync: pushToServerItems,
      clientAppId: await this.appService.getClientAppId(),
      syncSizeLimit: pageSize,
    };
    const response = await this.callSyncHistoryAPI(request);
    methodLogger.debug('receive item size', response.items.length);
    methodLogger.debug('total', response.total);

    // const promises = response.itemSinceLastSync.map(history => {
    //   return this.noteService.syncHistory(history);
    // });
    // await Promise.all(promises);

    // for now, we have to process it one by one
    // otherwise we may encounter concurrent related issue
    // e.g. Error: "Key already exists in the object store."
    for (const history of response.items) {
      await this.noteService.syncHistory(history);
    }

    // update last sync time
    await this.userService.setLastEvaluatedUpdateAt(new Date(response.lastEvaluatedUpdateAt));
    await this.userService.setLastSyncTime(new Date(response.serverLastSyncTime));
    return response;
  }

  async callSyncHistoryAPI(request: SyncHistoriesRequestV2): Promise<SyncHistoriesResponseV2> {
    let res = await axios.patch(`${APP_CONSTANTS.API_PREFIX}/histories/v2`, request);
    const data = res.data as SyncHistoriesResponseV2;
    // wrap history
    data.items = data.items.map(e => SearchHistory.wrap(e));
    return data;
  }

  // select histories where update time greater than last_sync_time
  async fetchPushToServerItems(
    user_id: string,
    last_sync_time: Date,
  ) {
    return this.historyService.searchByUpdateAt({
      user_id: user_id,
      updateAtBetween: {
        lowerBound: (new Date(last_sync_time)).valueOf(),
      }
    });
  }

}
