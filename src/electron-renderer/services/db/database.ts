import Dexie from 'dexie';
import { INote } from '../../../common/model/note';
import { ISearchHistory } from '../../../common/model/history';

class Database extends Dexie {
  notes: Dexie.Table<INote, number>;
  histories: Dexie.Table<ISearchHistory, number>;

  constructor(databaseName: string) {
    super(databaseName);
    // see https://dexie.org/docs/Version/Version.stores()
    // we use create_at as local primary key
    this.version(1).stores({
      histories: 'id,create_at,update_at,user_id,text',
      notes: 'id,create_at,update_at,user_id,text',
    });
    this.histories = this.table('histories'); // Just informing Typescript what Dexie has already done...
    this.notes = this.table('notes');
  }
}

const database = new Database('database');

database.open().catch(e => {
  console.error(`Open failed: ${e.stack}`);
});

export default database;