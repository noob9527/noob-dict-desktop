import { WindowService } from '../../common/services/window-service';
import { injectable } from 'inversify';

@injectable()
export class ElectronWindowService implements WindowService {
  getWindow(windowIdentifier): any | null {
    // todo
    return undefined;
  }
}