import React from 'react'
import styled from 'styled-components'
import { ThemedContent } from '../../components/themed-ui/content/content'
import { ThemedButton } from '../../components/themed-ui/button/button'
import { ThemedInput } from '../../components/themed-ui/input/input'
import { useRootStore } from '../../root-store'
import { SyncActions, useSyncStore } from './sync-store'

const Container = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  button + button {
    margin-left: 10px;
  }
`

const DeveloperPage = () => {
  const currentUser = useRootStore.use.currentUser()
  const lastEvaluatedUpdateAt = useRootStore.use.lastEvaluatedUpdateAt()
  const syncHistoryPageLimit = useSyncStore.use.syncHistoryPageLimit()
  const syncHistoryPageSize = useSyncStore.use.syncHistoryPageSize()

  let lastSyncTime: Date | null
  if (currentUser?.last_sync_time == null) {
    lastSyncTime = null
  } else {
    lastSyncTime = new Date(currentUser.last_sync_time)
  }

  return (
    <ThemedContent>
      <Container>
        <p>
          <span>last sync time:</span>
          <span>{lastSyncTime?.toLocaleString()}</span>
        </p>
        <p>
          <span>last evaluated:</span>
          <span>{lastEvaluatedUpdateAt?.toLocaleString()}</span>
        </p>
        <p>
          <span>sync history page size</span>
          <ThemedInput
            value={syncHistoryPageSize}
            type="number"
            onChange={(e) => {
              useSyncStore.setState({
                syncHistoryPageSize: Number(e.target.value),
              })
            }}
          />
        </p>
        <p>
          <span>sync history page limit</span>
          <ThemedInput
            value={syncHistoryPageLimit}
            type="number"
            onChange={(e) => {
              useSyncStore.setState({
                syncHistoryPageLimit: Number(e.target.value),
              })
            }}
          />
        </p>

        <div>
          <ThemedButton
            onClick={() => {
              SyncActions.syncHistoryPages()
            }}
          >
            Sync Histories
          </ThemedButton>

          <ThemedButton
            onClick={() => {
              SyncActions.resetSyncFlag()
            }}
          >
            Reset Sync Flag
          </ThemedButton>

          <ThemedButton
            onClick={() => {
              SyncActions.migrateLocalDB()
            }}
          >
            Migrate Local DB
          </ThemedButton>
        </div>
      </Container>
    </ThemedContent>
  )
}

export default DeveloperPage
