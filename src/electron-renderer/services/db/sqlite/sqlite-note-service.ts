import { NoteService } from '../../../../common/services/db/note-service';
import { ISearchHistory } from '../../../../common/model/history';
import { INote } from '../../../../common/model/note';
import { ipcCallMain } from '../../../utils/ipc-decorator';
import { LOCAL_DB_NOTE_PREFIX } from '../../../../electron-shared/ipc/ipc-channel-local-db';
import { injectable } from 'inversify';

@injectable()
export class SqliteNoteService implements NoteService {
  @ipcCallMain(LOCAL_DB_NOTE_PREFIX)
  async addHistory(history: ISearchHistory): Promise<INote> {
    return Promise.resolve({} as any);
  }

  @ipcCallMain(LOCAL_DB_NOTE_PREFIX)
  async fetch(text: string, user_id: string): Promise<Maybe<INote>> {
    return Promise.resolve({} as any);
  }

  @ipcCallMain(LOCAL_DB_NOTE_PREFIX)
  async fetchLatest(limit: number, user_id: string): Promise<INote[]> {
    return Promise.resolve({} as any);
  }

  @ipcCallMain(LOCAL_DB_NOTE_PREFIX)
  async syncHistory(history: ISearchHistory): Promise<void> {
    return Promise.resolve({} as any);
  }

}
