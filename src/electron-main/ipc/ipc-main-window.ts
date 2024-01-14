import { ipcMain } from 'electron-better-ipc'
import { WindowId } from '../../common/window-id'
import { WindowCommand } from '../../common/window-command'
import { windowManagerContainer } from '../window/window-manager-container'
import logger from '../../electron-shared/logger'

WindowId.values().forEach((windowId) => {
  WindowCommand.values().forEach((command) => {
    const windowManager = windowManagerContainer.find(windowId)
    if (!windowManager) {
      throw new Error(`no windowManager with id = ${windowId} can be found`)
    }
    const channelName = command.getIpcChannelName(windowId)
    ipcMain.answerRenderer(channelName, async () => {
      logger.debug('answerRenderer: ' + channelName)
      if (command != WindowCommand.open && !windowManager.created) {
        logger.error(`window with id ${windowId} is inactive`)
      } else {
        return windowManager.handleCommand(command)
      }
    })
  })
})
