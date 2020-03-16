import { AppService } from '../../common/services/app-service';
import { remote } from 'electron';
import { injectable } from 'inversify';

@injectable()
export class ElectronAppService implements AppService {
  getVersion(): string {
    return remote.app.getVersion();
  }

  getProcess(): NodeJS.Process {
    return remote.process
  }
}