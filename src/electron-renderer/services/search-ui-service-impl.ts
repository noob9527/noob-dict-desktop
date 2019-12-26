import { injectable } from 'inversify';
import { SearchUiService } from '../../common/services/search-ui-service';
import { ipcRenderer } from 'electron-better-ipc';
import { SearchChannel } from '../../common/ipc-channel';

@injectable()
export class ElectronSearchUiService implements SearchUiService {
  async toggleSearchWindow(option = { isSettingWindowOpen: false }): Promise<void> {
    await ipcRenderer.callMain(SearchChannel.TOGGLE_SEARCH_WINDOW, option);
  }

  async showSearchWindow() {
    return ipcRenderer.callMain(SearchChannel.SHOW_SEARCH_WINDOW);
  }

  async togglePin(): Promise<boolean> {
    const res = await ipcRenderer.callMain(SearchChannel.TOGGLE_PIN_SEARCH_WINDOW);
    return res as boolean;
  }

}
