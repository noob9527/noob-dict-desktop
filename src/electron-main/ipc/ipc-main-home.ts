// search channel
import { ipcMain } from 'electron-better-ipc'
import { homeWindowManager } from '../window/home-window'
import { SearchChannel } from '../../electron-shared/ipc/ipc-channel-search'

ipcMain.answerRenderer(SearchChannel.TOGGLE_PIN_SEARCH_WINDOW, () => {
  const window = homeWindowManager.getOrCreate()
  const top = window.isAlwaysOnTop()
  const target = !top
  window.setAlwaysOnTop(target)
  return target
})

ipcMain.answerRenderer(SearchChannel.SEARCH, async (data: any) => {
  const window = homeWindowManager.getOrCreate()
  window.show()
  if (data.text) {
    await ipcMain.callRenderer(window, SearchChannel.SEARCH, {
      text: data.text,
    })
  }
})
