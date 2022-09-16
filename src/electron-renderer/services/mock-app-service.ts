import { AppService } from '../../common/services/app-service';
import { injectable } from 'inversify';
import { machineId } from 'node-machine-id';

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
}
