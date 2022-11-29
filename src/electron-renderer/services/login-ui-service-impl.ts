import { LoginUiService } from '../../common/services/login-ui-service';
import { ipcRenderer } from 'electron-better-ipc';
import { injectable } from 'inversify';
import { LoginChannel } from '../../electron-shared/ipc/ipc-channel-login';


@injectable()
export class ElectronLoginUiService implements LoginUiService {
  async open(): Promise<boolean> {
    const res = await ipcRenderer.callMain(LoginChannel.SHOW_LOGIN_WINDOW);
    return res as boolean;
  }
}
