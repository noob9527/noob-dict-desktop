import { rendererContainer } from '../../../common/container/renderer-container'
import {
  UserService,
  UserServiceToken,
} from '../../../common/services/user-service'
import {
  GlobalHistoryService,
  GlobalHistoryServiceToken,
  ProgressInfo,
  SyncHistoryCallback,
} from '../../../common/services/global-history-service'
import { create } from 'zustand'
import { createSelectors } from '../../zustand/create-selectors'
import { RootActions, useRootStore } from '../../root-store'
import {
  WindowService,
  WindowServiceToken,
} from '../../../common/services/window-service'
import { WindowCommand } from '../../../common/window-command'
import { WindowId } from '../../../common/window-id'
import { devtools } from 'zustand/middleware'
import { Runtime } from '../../../electron-shared/runtime'
import { SyncHistoryChannel } from '../../../electron-shared/ipc/ipc-channel-sync-history'

const userService = rendererContainer.get<UserService>(UserServiceToken)
const globalHistoryService = rendererContainer.get<GlobalHistoryService>(
  GlobalHistoryServiceToken,
)
const windowService = rendererContainer.get<WindowService>(WindowServiceToken)

export interface SyncState {
  isSyncing: boolean
  syncHistoryPageSize: number
  syncHistoryPageLimit: number
  progressInfo: ProgressInfo | null
}

const initialState: SyncState = {
  isSyncing: false,
  syncHistoryPageSize: 20,
  syncHistoryPageLimit: 5,
  progressInfo: null,
}

const useSyncStoreBase = create<SyncState>()(
  devtools(() => initialState, {
    name: 'sync',
    enabled: Runtime.isDev,
  }),
)
export const useSyncStore = createSelectors(useSyncStoreBase)

export namespace SyncActions {
  export async function migrateLocalDB() {
    return globalHistoryService.migrateToSqlite()
  }

  export async function resetSyncFlag() {
    const currentUser = useRootStore.use.currentUser()
    if (currentUser == null) return

    const epoch = new Date(0)
    await userService.setLastEvaluatedUpdateAt(epoch)
    await RootActions.loadLastEvaluatedUpdateAt()
  }

  const callback: SyncHistoryCallback = async (event, data: any) => {
    switch (event) {
      case SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_STARTED:
        useSyncStore.setState({
          isSyncing: true,
        })
        break
      case SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_ERROR:
        useSyncStore.setState({
          isSyncing: false,
        })
        break
      case SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_FINISHED:
        useSyncStore.setState({
          isSyncing: false,
        })
        break
      case SyncHistoryChannel.Event.SYNC_SEARCH_HISTORY_EVENT_PROGRESS:
        useSyncStore.setState({
          isSyncing: true,
          progressInfo: data.progressInfo,
        })
        break
    }
  }

  export async function syncHistoryPages(
    pageLimit?: number,
    pageSize?: number,
  ) {
    const state = useSyncStore.getState()
    const limit = pageLimit ?? state.syncHistoryPageLimit
    const size = pageSize ?? state.syncHistoryPageSize
    await globalHistoryService.syncHistoryPages(limit, size, callback)
    // we update current user when sync finished
    // hence we reload it here
    await RootActions.reloadCurrentUserFromStorage()
  }

  export function openSyncWindow() {
    windowService.sendCommand(WindowId.SYNC, WindowCommand.open)
  }
}
