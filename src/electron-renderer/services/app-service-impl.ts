import { AppService } from '../../common/services/app-service';
import * as remote from '@electron/remote';
import { injectable } from 'inversify';

@injectable()
export class ElectronAppService implements AppService {
  getVersion(): string {
    return remote.app.getVersion();
  }

  getProcess(): NodeJS.Process {
    return remote.process;
  }
}
