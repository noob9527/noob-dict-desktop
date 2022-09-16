import { AppService } from '../../common/services/app-service';
import * as remote from '@electron/remote';
import { injectable } from 'inversify';
import { Runtime } from '../../electron-shared/runtime';
import { ipcRenderer } from 'electron-better-ipc';
import { AppChannel } from '../../common/ipc-channel';

@injectable()
export class ElectronAppService implements AppService {
  getVersion(): string {
    return remote.app.getVersion();
  }

  getProcess(): NodeJS.Process {
    return Runtime.process;
  }

  async getClientAppId(): Promise<string> {
    return ipcRenderer.callMain<void, string>(AppChannel.GET_CLIENT_APP_ID);
  }
}
