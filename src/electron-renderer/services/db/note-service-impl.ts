import database from './database';
import { injectable } from 'inversify';
import { NoteService } from '../../../common/services/db/note-service';
import { INote, Note } from '../../../common/model/note';
import { HistoryService, HistoryServiceToken } from '../../../common/services/db/history-service';
import { rendererContainer } from '../../../common/container/renderer-container';
import { SearchHistory } from '../../../common/model/history';
import logger from '../../../common/utils/logger';

@injectable()
export class DexieNoteService implements NoteService {
  private historyService: HistoryService;

  constructor() {
    this.historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);
  }

  async fetch(text: string): Promise<Maybe<INote>> {
    const res = await database.notes.where('text').equals(text).first();
    if (!res) return res;

    if (res) {
      res.histories = await this.historyService.findAll(text);
    }
    return Note.wrap(res);
  }

  async fetchLatest(limit: number): Promise<INote[]> {
    return database.notes
      .orderBy('updateAt')
      .limit(limit)
      .reverse()
      .toArray();
  }

  async search(text: string, part: Partial<INote>): Promise<INote> {
    let note = await this.fetch(text);
    const history = SearchHistory.create({ text });
    if (!note) {
      note = Note.create({
        ...part,
        text,
        histories: [history],
      });
    } else {
      logger.log('add hist start', note.histories.length, note.histories);
      note.histories.push(history);
      logger.log('add hist end', note.histories.length);
    }
    return this.saveOrUpdate(note);
  }

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