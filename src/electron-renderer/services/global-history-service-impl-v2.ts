import {
  GlobalHistoryService,
  ProgressInfo,
  SyncHistoryCallback,
} from '../../common/services/global-history-service'
import { injectable } from 'inversify'
import {
  DexieHistoryServiceToken,
  HistoryService,
  LocalHistoryServiceToken,
} from '../../common/services/db/history-service'
import { rendererContainer } from '../../common/container/renderer-container'
import {
  DexieNoteServiceToken,
  LocalNoteServiceToken,
  NoteService,
} from '../../common/services/db/note-service'
import logger from '../../electron-shared/logger'
import {
  UserService,
  UserServiceToken,
} from '../../common/services/user-service'
import axios from 'axios'
import { APP_CONSTANTS } from '../../common/app-constants'
import { ISearchHistory, SearchHistory } from '../../common/model/history'
import { AppService, AppServiceToken } from '../../common/services/app-service'
import { User } from '../../common/model/user'
import { DexieNoteService } from './db/dexie/dexie-note-service'
import { DexieHistoryService } from './db/dexie/dexie-history-service'
import { ipcRenderer } from 'electron-better-ipc'
import { SyncHistoryChannel } from '../../electron-shared/ipc/ipc-channel-sync-history'
import { timer } from '../../common/utils/promise-extension'

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

/**
 * historically, we sync search history in renderer process
 * (historically, we use indexed db)
 * in the future, we might sync it in main process
 */
@injectable()
export class GlobalHistoryServiceImplV2 implements GlobalHistoryService {
  private historyService: HistoryService
  private noteService: NoteService
  private userService: UserService
  private appService: AppService
  private dexieNoteService: NoteService
  private dexieHistoryService: HistoryService

  private log = logger.getLogger('GlobalHistoryServiceImpl')

  constructor() // @inject(HistoryServiceToken) private historyService: HistoryService, // see https://github.com/inversify/InversifyJS/issues/1004
  // @inject(NoteServiceToken) private noteService: NoteService,
  // @inject(UserServiceToken) private userService: UserService,
  // @inject(AppServiceToken) private appService: AppService,
  {
    this.historyService = rendererContainer.get<HistoryService>(
      LocalHistoryServiceToken,
    )
    this.noteService = rendererContainer.get<NoteService>(LocalNoteServiceToken)
    this.dexieNoteService = rendererContainer.get<DexieNoteService>(
      DexieNoteServiceToken,
    )
    this.dexieHistoryService = rendererContainer.get<DexieHistoryService>(
      DexieHistoryServiceToken,
    )
    this.userService = rendererContainer.get<UserService>(UserServiceToken)
    this.appService = rendererContainer.get<AppService>(AppServiceToken)
  }

  /**
   * sync search history between server and client.
   */
  async syncHistoryPages(
    pageLimit: number,
    pageSize: number,
    callback?: SyncHistoryCallback,
  ) {
    const methodLogger = this.log.getLogger('syncHistoryPages')
    methodLogger.debug('start syncHistoryPages')

    const currentUser = await this.userService.fetchCurrentUserFromStorage()
    if (!currentUser) {
      methodLogger.debug('sync terminated as no logged in user')
      return
    }
    await callback?.(SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_STARTED)
    await ipcRenderer.callMain(
      SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_STARTED,
    )

    let response: SyncHistoriesResponseV2
    let currentPageIndex = 0
    let remainingItems = 0

    // for calculating progress
    let isFirstPage = true
    let totalItems = 0
    let totalPages = 0
    do {
      const pushItemsToServer = currentPageIndex === 0
      try {
        response = await this.syncSingleHistoryPage(
          currentUser,
          pageSize,
          pushItemsToServer,
        )
      } catch (e) {
        methodLogger.error(e)
        await callback?.(
          SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_ERROR,
          {
            error: e,
          },
        )
        // error might not be serializable
        await ipcRenderer.callMain(
          SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_ERROR,
          {
            error_message: e instanceof Error ? e.message : null,
          },
        )
        // somehow electron will try to send the error to main process
        // if the error cannot be serialized, the following error will be thrown
        // Error: An object could not be cloned.
        // at o.send node:electron/js2c/renderer_init
        // and the process stuck.
        // somehow, we cannot handle the error in main process.
        // hence, we handle the error here.
        break
        // throw e
      }
      remainingItems = response.total - response.count
      let remainingPages = Math.min(
        Math.ceil(remainingItems / pageSize),
        pageLimit - currentPageIndex - 1,
      )

      // update progress
      if (isFirstPage) {
        totalItems = response.total
        totalPages = remainingPages + 1
        isFirstPage = false
      }
      const finishedPages = currentPageIndex + 1
      const progressInfo: ProgressInfo = {
        percent: Math.floor((currentPageIndex + 1) / totalPages),
        totalPages,
        totalItems,
        finishedPages,
        finishedItems: pageSize * finishedPages,
        pageSize,
      }

      await callback?.(
        SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_PROGRESS,
        progressInfo,
      )
      await ipcRenderer.callMain(
        SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_PROGRESS,
        progressInfo,
      )

      methodLogger.debug('current page index: ' + currentPageIndex)
      methodLogger.debug('remaining items: ' + remainingItems)
      methodLogger.debug('remaining pages: ' + remainingPages)
    } while (remainingItems > 0 && ++currentPageIndex < pageLimit)

    await callback?.(
      SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_FINISHED,
    )
    await ipcRenderer.callMain(
      SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_FINISHED,
    )
    methodLogger.debug('end syncHistoryPages')
  }

  private async syncSingleHistoryPage(
    currentUser: User,
    pageSize: number,
    pushItemsToServer: boolean,
  ) {
    const methodLogger = this.log.getLogger('syncSingleHistoryPage')

    // for test
    // await timer(2000)
    // throw new Error('gotcha')

    const lastEvaluatedUpdateAt =
      (await this.userService.getLastEvaluatedUpdateAt()) ?? new Date(0)
    const lastSyncTime =
      (await this.userService.getLastSyncTime()) ?? new Date(0)

    let pushToServerItems: ISearchHistory[] = []
    if (pushItemsToServer) {
      pushToServerItems = await this.fetchPushToServerItems(
        currentUser.id,
        new Date(currentUser.last_sync_time),
      )
      methodLogger.debug('send item size', pushToServerItems.length)
    }

    const request = {
      clientLastSyncTime: lastSyncTime,
      lastEvaluatedUpdateAt: lastEvaluatedUpdateAt,
      itemSinceLastSync: pushToServerItems,
      clientAppId: await this.appService.getClientAppId(),
      syncSizeLimit: pageSize,
    }
    const response = await this.callSyncHistoryAPI(request)
    methodLogger.debug('receive item size', response.items.length)
    methodLogger.debug('total', response.total)

    // const promises = response.itemSinceLastSync.map(history => {
    //   return this.noteService.syncHistory(history);
    // });
    // await Promise.all(promises);

    // for now, we have to process it one by one
    // otherwise we may encounter concurrent related issue
    // e.g. Error: "Key already exists in the object store."
    for (const history of response.items) {
      await this.noteService.syncHistory(history)
    }

    // update last sync time
    await this.userService.setLastEvaluatedUpdateAt(
      new Date(response.lastEvaluatedUpdateAt),
    )
    await this.userService.setLastSyncTime(
      new Date(response.serverLastSyncTime),
    )
    return response
  }

  async callSyncHistoryAPI(
    request: SyncHistoriesRequestV2,
  ): Promise<SyncHistoriesResponseV2> {
    let res = await axios.patch(
      `${APP_CONSTANTS.API_PREFIX}/histories/v2`,
      request,
    )
    const data = res.data as SyncHistoriesResponseV2
    // wrap history
    data.items = data.items.map((e) => SearchHistory.wrap(e))
    return data
  }

  // select histories where update time greater than last_sync_time
  async fetchPushToServerItems(user_id: string, last_sync_time: Date) {
    return this.historyService.searchByUpdateAt({
      user_id: user_id,
      updateAtBetween: {
        lowerBound: new Date(last_sync_time).valueOf(),
      },
    })
  }

  async migrateToSqlite() {
    const methodLogger = this.log.getLogger('migrateToSqlite')
    const service = this.dexieHistoryService as DexieHistoryService
    const items = await service.findForMigration()
    methodLogger.debug(`about to migrate ${items.length} items`)
    const promises = items.map((e) => this.noteService.syncHistory(e))
    await Promise.all(promises)
  }
}
