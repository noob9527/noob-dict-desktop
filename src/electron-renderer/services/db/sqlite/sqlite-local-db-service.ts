import { LocalDbService } from '../../../../common/services/db/local-db-service';
import { ipcCallMain } from '../../../utils/ipc-decorator';
import { injectable } from 'inversify';
import { LOCAL_DB_PREFIX } from '../../../../electron-shared/ipc/ipc-channel-local-db';

@injectable()
export class SqliteLocalDbService implements LocalDbService {
  @ipcCallMain(LOCAL_DB_PREFIX)
  async fetchAvailable(): Promise<boolean> {
    return Promise.resolve(false);
  }

  @ipcCallMain(LOCAL_DB_PREFIX)
  init() {
  }
}
