import database from './database';
import { injectable } from 'inversify';
import { NoteService } from '../../../common/services/db/note-service';
import { INote } from '../../../common/model/note';

@injectable()
export class DexieNoteService implements NoteService {
  async findOne(text: string): Promise<Maybe<INote>> {
    return database.notes.where('text').equals(text).first();
  }

  async save(note: INote): Promise<INote> {
    note.id = await database.notes.add(note);
    return note;
  }
}