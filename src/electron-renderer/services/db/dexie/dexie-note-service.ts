import database from './dexie-index-db';
import { injectable } from 'inversify';
import { NoteService } from '../../../../common/services/db/note-service';
import { INote, Note } from '../../../../common/model/note';
import { HistoryService, DexieHistoryServiceToken } from '../../../../common/services/db/history-service';
import { rendererContainer } from '../../../../common/container/renderer-container';
import type { ISearchHistory } from '../../../../common/model/history';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../../../electron-shared/logger';

@injectable()
export class DexieNoteService implements NoteService {
  private historyService: HistoryService;
  private log = logger.getLogger(DexieNoteService.name);

  constructor() {
    this.historyService = rendererContainer.get<HistoryService>(DexieHistoryServiceToken);
  }

  async fetch(text: string, user_id: string = ''): Promise<Maybe<INote>> {
    const res = await database.notes
      .where({ text, user_id })
      .first();
    if (!res) return res;

    if (res) {
      res.histories = await this.historyService.findAll(text, user_id);
    }
    return Note.wrap(res);
  }

  // If the filter is narrow and the result set is small, choose where() to utilize the index for filtering,
  // combined with sortBy() on the collection (or just sort the resulting array using Array.sort()).
  // If the result set is large or filter is broad, you would probably be better of using orderBy()
  // to utilize the index for sorting and combine with Collection.filter() for filtering.
  // If you use limit() on the Collection, this is also normally the best choice.
  // https://github.com/dfahlander/Dexie.js/issues/297#issuecomment-236725797
  async fetchLatest(limit: number, user_id: string = ''): Promise<INote[]> {
    return database.notes
      .orderBy('update_at')
      .reverse()
      .filter(e => e.user_id === user_id)
      .limit(limit)
      .toArray();
  }

  async addHistory(history: ISearchHistory): Promise<INote> {
    this.log.debug(this.addHistory.name, history);

    await this.historyService.add(history);
    let note = await this.fetch(history.text, history.user_id);
    if (!note) {
      note = Note.create({
        user_id: history.user_id,
        text: history.text
      });
      await this.add(note)
    } else {
      await this.update(note);
    }
    note.histories.push(history);
    return note;
  }

  /**
   * sync history with server
   * called after sync2server request success
   *
   * create or update a history(without changing its update_at property)
   * @param history
   */
  async syncHistory(history: ISearchHistory): Promise<void> {
    this.log.debug(this.syncHistory.name, history);

    const existed = await database.histories
      .where('id')
      .equals(history.id!!)
      .first();
    if (existed) {
      this.log.debug(this.syncHistory.name, 'update history');
      // we do not call this.update as we don't want to change history.update_at
      await database.histories.update(history.id!!, history);
    } else {
      await this.addHistory(history)
    }
  }

  async add(note: INote): Promise<INote> {
    this.log.debug(this.add.name, note);
    const now = new Date().valueOf();
    note.id = uuidv4();
    note.create_at = now;
    note.update_at = now;
    await database.notes.add(note);
    return note;
  }

  async update(note: INote): Promise<INote> {
    this.log.debug(this.update.name, 'before', note);
    note.update_times++;
    note.update_at = (new Date()).valueOf();
    await database.notes.update(note.id!!, {
      update_at: note.update_at,
      update_times: note.update_times,
    });
    this.log.debug(this.update.name, 'after', note);
    return note;
  }

}
