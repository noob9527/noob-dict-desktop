import Dexie from 'dexie';
import { INote } from '../../../common/model/note';
import { ISearchHistory } from '../../../common/model/history';

class Database extends Dexie {
  notes: Dexie.Table<INote, number>;
  histories: Dexie.Table<ISearchHistory, number>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      histories: '++id,text,createAt',
      notes: '++id,text,createAt',
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