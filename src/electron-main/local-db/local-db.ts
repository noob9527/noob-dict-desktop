import logger from '../../electron-shared/logger';
import { NoobDictDB } from './sequelize/noob-dict-db';

export class LocalDB {

  private static noobDictDB: NoobDictDB | null = null;

  static initDb(path: string) {
    logger.log('Local DB file location has been set to: ' + path);
    try {
      LocalDB.noobDictDB = new NoobDictDB(path);
    } catch (e) {
      LocalDB.noobDictDB = null;
    }
  }

  static handleDbFileLocationChange(
    newValue: string | null,
    oldValue: string | null = null
  ) {
    if (!newValue)
      LocalDB.noobDictDB = null;
    else if (newValue===oldValue)
      return newValue;
    else {
      logger.log('Local DB file location has been set to: ' + newValue);
      try {
        LocalDB.noobDictDB = new NoobDictDB(newValue);
      } catch (e) {
        LocalDB.noobDictDB = null;
      }
    }
  }

  static isAvailable() {
    if (LocalDB.noobDictDB==null) return Promise.resolve(false);
    // logger.log('isAvailable', LocalDB.noobDictDB);
    return LocalDB.noobDictDB.testDbConnection();
  }

}
