import { rendererContainer } from '../../../common/container/renderer-container'
import {
  UserService,
  UserServiceToken,
} from '../../../common/services/user-service'
import {
  GlobalHistoryService,
  GlobalHistoryServiceToken,
} from '../../../common/services/global-history-service'
import { create } from 'zustand'
import { createSelectors } from '../../zustand/create-selectors'
import { RootActions, useRootStore } from '../../root-store'

const userService = rendererContainer.get<UserService>(UserServiceToken)
const globalHistoryService = rendererContainer.get<GlobalHistoryService>(
  GlobalHistoryServiceToken,
)

export interface SyncState {
  syncHistoryPageSize: number
  syncHistoryPageLimit: number
}

const initialState: SyncState = {
  syncHistoryPageSize: 20,
  syncHistoryPageLimit: 5,
}

const useSyncStoreBase = create<SyncState>()(() => initialState)
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

  export async function syncHistories() {
    await globalHistoryService.syncHistories()
    // we update current user when sync finished
    // hence we reload it here
    await RootActions.reloadCurrentUserFromStorage()
  }

  export async function syncHistoryPages() {
    const pageSize = useSyncStore.use.syncHistoryPageSize()
    const pageLimit = useSyncStore.use.syncHistoryPageLimit()
    await globalHistoryService.syncHistoryPages(pageSize, pageLimit)
    // we update current user when sync finished
    // hence we reload it here
    await RootActions.reloadCurrentUserFromStorage()
  }
}
