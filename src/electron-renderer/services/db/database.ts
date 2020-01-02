import Dexie from 'dexie';
import { INote } from '../../../browser/db/note';
import { IHistory } from '../../../browser/db/history';

class Database extends Dexie {
  notes: Dexie.Table<INote, number>; // todo: remove it!
  histories: Dexie.Table<IHistory, number>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      histories: '++id,text,create_at',
      notes: '++id,text,create_at',
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