import { BrowserWindow } from 'electron'
import { windowContainer } from './windows'
import { WindowId } from '../../common/window-id'
import logger from '../../electron-shared/logger'
import { WindowCommand } from '../../common/window-command'
import { ipcMain } from 'electron-better-ipc'
import { WindowEvent } from '../../common/window-event'

interface WindowManager {
  show()

  hide()

  toggle()

  close()

  top()
}

export abstract class AbstractWindowManager implements WindowManager {
  protected _window: BrowserWindow | null = null

  protected abstract customizedCreate(): BrowserWindow

  abstract id: WindowId

  private create() {
    const window = this.customizedCreate()
    this._window = window
    windowContainer.add(this.id, window)
    this.notifyRendererWindowEvents()
    this.listenWindowCommands()
    // Emitted when the window is closed.
    this._window!!.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.onClosed()
    })
    return window
  }

  notifyRendererWindowEvents() {
    WindowEvent.values().forEach((event) => {
      const channelName = event.getIpcChannelName(this.id)
      this._window!!.on(event as any, (e) => {
        // by default, we only notify this window.
        // consider broadcast the event instead?
        ipcMain.callRenderer(this._window!!, channelName)
      })
    })
  }

  listenWindowCommands() {
    WindowCommand.values().forEach((command) => {
      const channelName = command.getIpcChannelName(this.id)
      ipcMain.answerRenderer(channelName, async () => {
        logger.debug('answerRenderer: ' + channelName)
        return this.handleCommand(command)
      })
    })
  }

  onClosed() {
    this.logger.log('closed')
    this.destroy()
  }

  getOrCreate() {
    if (this._window) return this._window

    this._window = this.create()
    windowContainer.add(this.id, this._window)
    return this._window
  }

  destroy() {
    this._window = null
    windowContainer.remove(this.id)
    this.logger.log('destroy')
  }

  show() {
    this.getOrCreate().show()
    this.logger.log('show')

    // if (window) {
    //   if (window.isMinimized()) window.restore();
    //   window.show();
    // } else {
    //   logger.error('somehow window doesn\'t exist');
    // }
  }

  hide() {
    this.getOrCreate().hide()
    this.logger.log('hide')
  }

  top() {
    this.getOrCreate().moveTop()
    this.logger.log('top')
  }

  toggle() {
    this.logger.log('toggle', new Date())
    const window = this.getOrCreate()
    if (window.isMinimized() || !window.isVisible()) {
      this.show()
      return true
    } else {
      this.hide()
      return false
    }
  }

  close() {
    if (!this._window) return
    this._window.close()
    this.logger.log('close')
  }

  handleCommand(command: WindowCommand) {
    const handler = this[command.name] as () => {}
    if (!handler) {
      this.logger.error(`No available handler for '${command}' command`)
      return
    }
    handler.call(this)
  }

  get logger() {
    return logger.getLogger(this.id.name)
  }
}
