import { WindowService } from '../../common/services/window-service'
import { injectable } from 'inversify'
import { WindowId } from '../../common/window-id'
import { WindowCommand } from '../../common/window-command'
import { ipcRenderer } from 'electron-better-ipc'

@injectable()
export class ElectronWindowService implements WindowService {
  sendCommand(windowId: WindowId, command: WindowCommand) {
    const channel = command.getIpcChannelName(windowId)
    return ipcRenderer.callMain(channel)
  }
}
