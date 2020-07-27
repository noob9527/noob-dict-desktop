import { injectable } from 'inversify';
import { SearchUiService } from '../../common/services/search-ui-service';
import { ipcRenderer } from 'electron-better-ipc';
import { SearchChannel } from '../../common/ipc-channel';

@injectable()
export class ElectronSearchUiService implements SearchUiService {
  async toggleSearchWindow(option: { isSettingWindowOpen }): Promise<void> {
    await ipcRenderer.callMain(SearchChannel.TOGGLE_SEARCH_WINDOW, option);
  }

  async showSearchWindow(option: { isSettingWindowOpen }) {
    return ipcRenderer.callMain(SearchChannel.SHOW_SEARCH_WINDOW);
  }

  async hideSearchWindow(option: { isSettingWindowOpen }) {
    return ipcRenderer.callMain(SearchChannel.HIDE_SEARCH_WINDOW);
  }

  async topSearchWindow(option: { isSettingWindowOpen }) {
    return ipcRenderer.callMain(SearchChannel.TOP_SEARCH_WINDOW, option);
  }

  async search(option: { text: string }) {
    return ipcRenderer.callMain(SearchChannel.SEARCH, option);
  }

  async togglePin(): Promise<boolean> {
    const res = await ipcRenderer.callMain(SearchChannel.TOGGLE_PIN_SEARCH_WINDOW);
    return res as boolean;
  }

}
