import { injectable } from 'inversify'
import { HomeUiService } from '../../common/services/home-ui-service'
import { ipcRenderer } from 'electron-better-ipc'
import { SearchChannel } from '../../electron-shared/ipc/ipc-channel-search'
import { ipcCallMain } from '../utils/ipc-decorator'
import { WindowId } from '../../common/window-id'
import logger from '../../electron-shared/logger';

@injectable()
export class ElectronHomeUiService implements HomeUiService {
  @ipcCallMain(WindowId.HOME.name + '/COMMAND')
  async toggle() {
    logger.error('delegation failed')
  }

  @ipcCallMain(WindowId.HOME.name + '/COMMAND')
  async show() {
    logger.error('delegation failed')
  }

  @ipcCallMain(WindowId.HOME.name + '/COMMAND')
  async hide() {
    logger.error('delegation failed')
  }

  @ipcCallMain(WindowId.HOME.name + '/COMMAND')
  async top() {
    logger.error('delegation failed')
  }

  async search(option: { text: string }) {
    return ipcRenderer.callMain(SearchChannel.SEARCH, option)
  }

  async togglePin(): Promise<boolean> {
    const res = await ipcRenderer.callMain(
      SearchChannel.TOGGLE_PIN_SEARCH_WINDOW,
    )
    return res as boolean
  }
}
