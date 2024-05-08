import { BrowserWindow } from 'electron'
import { WindowId } from '../../common/window-id'
import logger from '../../electron-shared/logger'
import { WindowCommand } from '../../common/window-command'
import { ipcMain } from 'electron-better-ipc'
import { WindowEvent } from '../../common/window-event'

export interface WindowManager {
  // e.g. if we want to broadcast an event
  // we only broadcast to created window
  get created(): boolean

  get window(): BrowserWindow | null

  /**
   * usually,
   * most window auto 'show' when it is ready,
   * hence, you can think of this method will also open the window.
   */
  getOrCreate(): BrowserWindow

  open()

  show()

  hide()

  toggle()

  close()

  top()

  handleCommand(command: WindowCommand)
}

export abstract class AbstractWindowManager implements WindowManager {
  protected _window: BrowserWindow | null = null

  protected abstract customizedCreate(): BrowserWindow

  abstract id: WindowId

  private privateCreate() {
    const window = this.customizedCreate()
    this._window = window
    this.notifyRendererWindowEvents()
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
        const window = this._window
        if (window && !window.isDestroyed()) {
          // by default, we only notify this window.
          // consider broadcast the event instead?
          ipcMain.callRenderer(this._window!!, channelName)
        }
      })
    })
  }

  onClosed() {
    this.logger.log('closed')
    this.destroy()
  }

  get created(): boolean {
    return !!this._window
  }

  getOrCreate() {
    if (this._window) return this._window

    this._window = this.privateCreate()
    return this._window
  }

  destroy() {
    // dereference
    this._window = null
    this.logger.log('destroy')
  }

  open() {
    this.show()
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

  get window(): BrowserWindow | null {
    return this._window
  }
}
