import { AppService } from '../../common/services/app-service';
import * as remote from '@electron/remote';
import { injectable } from 'inversify';
import { ipcRenderer } from 'electron-better-ipc';
import { AppChannel } from '../../electron-shared/ipc/ipc-channel-app';

@injectable()
export class ElectronAppService implements AppService {
  getVersion(): string {
    return remote.app.getVersion();
  }

  getUserDataFolder() {
    return remote.app.getPath('userData');
  }

  getProcess(): NodeJS.Process {
    return remote.process;
  }

  async getClientAppId(): Promise<string> {
    return ipcRenderer.callMain<void, string>(AppChannel.GET_CLIENT_APP_ID);
  }
}
