import Dexie from 'dexie';
import { INote } from './note';
import { IHistory } from './history';

class Database extends Dexie {
  notes: Dexie.Table<INote, number>;
  histories: Dexie.Table<IHistory, number>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      notes: '++id,text,create_at',
      histories: '++id,text,create_at',
    });
    this.notes = this.table('notes'); // Just informing Typescript what Dexie has already done...
    this.histories = this.table('histories');
  }
}

const database = new Database('database');

database.open().catch(e => {
  console.error(`Open failed: ${e.stack}`);
});

export default database;