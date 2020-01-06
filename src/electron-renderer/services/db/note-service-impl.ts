import database from './database';
import { injectable } from 'inversify';
import { NoteService } from '../../../common/services/db/note-service';
import { INote, Note } from '../../../common/model/note';
import { HistoryService, HistoryServiceToken } from '../../../common/services/db/history-service';
import { rendererContainer } from '../../../common/container/renderer-container';
import { SearchHistory } from '../../../common/model/history';

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
    return new Note(res);
  }

  async search(text: string, part: Partial<INote>): Promise<INote> {
    let note = await this.fetch(text);
    const history = new SearchHistory({ text });
    if (!note) {
      note = new Note({
        ...part,
        text,
        histories: [history],
      });
    } else {
      note.histories.push(history);
    }
    return this.saveOrUpdate(note);
  }

  async saveOrUpdate(note: INote): Promise<INote> {
    if (note.id) {
      // update
      note.updateTimes++;
    } else {
      // create

    }
    note.id = await database.notes.add(note);
    // todo: we may need transaction here
    // todo: what if we change the content of a history
    // cascade persist history
    const promises = note.histories.filter(e => !e.id)
      .map(e => database.histories.add(e));
    await Promise.all(promises);
    return note;
  }

}