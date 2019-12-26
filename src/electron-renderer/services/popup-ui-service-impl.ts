import { PopupUiService } from '../../common/services/popup-ui-service';
import { ipcRenderer } from 'electron-better-ipc';
import { injectable } from 'inversify';
import { PopupChannel } from '../../common/ipc-channel';


@injectable()
export class ElectronPopupUiService implements PopupUiService {
  // todo, show at specified position
  async show(): Promise<boolean> {
    const res = await ipcRenderer.callMain(PopupChannel.SHOW_POPUP_WINDOW);
    return res as boolean;
  }
}
