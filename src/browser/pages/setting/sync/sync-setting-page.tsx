import { debounceSettingChange, useSettingStore } from '../setting-store'
import React from 'react'
import styled from 'styled-components'
import { ThemedCheckbox } from '../../../components/themed-ui/input/checkbox'

const Container = styled.div`
  > div {
    margin: 30px 0;
  }
`

export const SyncSettingPage = () => {
  const syncOnQuit = useSettingStore.use['search.syncHistory.syncOnQuit']()
  const syncOnStart = useSettingStore.use['search.syncHistory.syncOnStart']()
  const syncIntervalMinutes =
    useSettingStore.use['search.syncHistory.syncIntervalMinutes']()
  const autoSyncInBackground = syncIntervalMinutes > 0
  return (
    <Container>
      <div>
        <ThemedCheckbox
          checked={syncOnStart}
          onChange={(event) => {
            debounceSettingChange({
              'search.syncHistory.syncOnStart': event?.target?.checked!!,
            })
          }}
        >
          Sync On Start
        </ThemedCheckbox>
      </div>
      <div>
        <ThemedCheckbox
          checked={syncOnQuit}
          onChange={(event) => {
            debounceSettingChange({
              'search.syncHistory.syncOnQuit': event?.target?.checked!!,
            })
          }}
        >
          Sync On Quit
        </ThemedCheckbox>
      </div>
      <div>
        <ThemedCheckbox
          checked={autoSyncInBackground}
          onChange={(event) => {
            debounceSettingChange({
              'search.syncHistory.syncIntervalMinutes': event?.target?.checked
                ? 60
                : -1,
            })
          }}
        >
          Auto Sync In Background
        </ThemedCheckbox>
      </div>
    </Container>
  )
}
