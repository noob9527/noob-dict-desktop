import database from './database';
import { injectable } from 'inversify';
import { NoteService } from '../../../common/services/db/note-service';
import { INote, Note } from '../../../common/model/note';
import { HistoryService, HistoryServiceToken } from '../../../common/services/db/history-service';
import { rendererContainer } from '../../../common/container/renderer-container';
import { ISearchHistory } from '../../../common/model/history';

@injectable()
export class DexieNoteService implements NoteService {
  private historyService: HistoryService;

  constructor() {
    this.historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);
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
      .orderBy('updateAt')
      .reverse()
      .filter(e => e.user_id === user_id)
      .limit(limit)
      .toArray();
  }

  async addHistory(history: ISearchHistory): Promise<INote> {
    let note = await this.fetch(history.text, history.user_id);
    if (!note) {
      note = Note.create({
        user_id: history.user_id,
        searchResult: history.searchResult,
        text: history.text,
        histories: [history],
      });
    } else {
      note.histories.push(history);
    }
    return this.saveOrUpdate(note);
  }

  // cascade handle add/remove/update history
  async saveOrUpdate(note: INote): Promise<INote> {
    if (note.id) {
      // update
      note.updateTimes++;
      note.updateAt = (new Date()).getTime();
      await database.notes.update(note.id, {
        updateAt: note.updateAt,
        updateTimes: note.updateTimes,
      });
    } else {
      // create
      note.id = await database.notes.add(note);
    }
    // cascade persist history
    const promises = note.histories.filter(e => !e.id)
      .map(e => this.historyService.add(e));
    await Promise.all(promises);
    return note;
  }

}