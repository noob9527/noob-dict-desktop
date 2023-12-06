import { AppService } from '../../common/services/app-service';
import { injectable } from 'inversify';
import { machineId } from 'node-machine-id';
import * as remote from '@electron/remote';

@injectable()
export class MockAppService implements AppService {
  getVersion(): string {
    return '';
  }

  getProcess(): NodeJS.Process {
    return process;
  }

  async getClientAppId(): Promise<string> {
    return machineId(true);
  }

  getUserDataFolder(): string {
    return '';
  }
}
