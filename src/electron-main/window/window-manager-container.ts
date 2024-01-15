import { ipcMain } from 'electron-better-ipc'
import { WindowId } from '../../common/window-id'
import { WindowManager } from './window-manager'
import { homeWindowManager } from './home-window'
import { syncWindowManager } from './sync-window'
import { loginWindowManager } from './login-window'
import { settingWindowManager } from './setting-window'
import { debugWindowManager } from './debug-window'
import logger from '../../electron-shared/logger'

class WindowManagerContainer {
  private map: Map<WindowId, WindowManager> = new Map()
  private log = logger.getLogger('WindowManagerContainer')

  add(id: WindowId, window: WindowManager): WindowManager {
    this.map.set(id, window)
    return window
  }

  find(id: WindowId): WindowManager | undefined {
    return this.map.get(id)
  }

  remove(id: WindowId) {
    this.map.delete(id)
  }

  broadcast(channel: string, data?: any): Promise<unknown> {
    this.log.debug(`[broadcast] channel: ${channel}, data: ${data}`)
    const promises = this.all()
      .filter((window) => window.created)
      .map((window) =>
        ipcMain.callRenderer(window.getOrCreate(), channel, data),
      )
    return Promise.all(promises)
  }

  private all(): WindowManager[] {
    return Array.from(this.map).map(([key, value]) => value)
  }
}

export const windowManagerContainer = new WindowManagerContainer()

windowManagerContainer.add(WindowId.HOME, homeWindowManager)
windowManagerContainer.add(WindowId.SETTING, settingWindowManager)
windowManagerContainer.add(WindowId.LOGIN, loginWindowManager)
windowManagerContainer.add(WindowId.DEVELOPER, debugWindowManager)
windowManagerContainer.add(WindowId.SYNC, syncWindowManager)
