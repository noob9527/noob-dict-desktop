import Dexie from 'dexie';
import { INote } from '../../../../common/model/note';
import { type ISearchHistory } from '../../../../common/model/history';

class DexieIndexDb extends Dexie {
  notes: Dexie.Table<INote, string>;
  histories: Dexie.Table<ISearchHistory, string>;

  constructor(databaseName: string) {
    super(databaseName);
    // see https://dexie.org/docs/Version/Version.stores()
    // we use create_at as local primary key
    this.version(1).stores({
      histories: 'id,create_at,update_at,user_id,text',
      notes: 'id,create_at,update_at,user_id,text',
    });
    this.version(2).stores({
      histories: 'id,create_at,update_at,[text+user_id]',
      notes: 'id,create_at,update_at,[text+user_id]',
    });
    this.histories = this.table('histories'); // Just informing Typescript what Dexie has already done...
    this.notes = this.table('notes');
  }
}

const database = new DexieIndexDb('database');

database.open().catch(e => {
  console.error(`Open failed: ${e.stack}`);
});

export default database;
