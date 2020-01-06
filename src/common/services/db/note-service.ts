import { INote } from '../../model/note';

export const NoteServiceToken = Symbol.for('note-service');

export interface NoteService {
  // cascade handle add/remove/update history
  saveOrUpdate(note: INote): Promise<INote>

  // cascade fetch corresponding histories
  fetch(text: string): Promise<Maybe<INote>>

  // if the note is not present
  // create one based on the second argument
  // else the second argument is ignored
  // note: this method also add a search history to histories fields
  // this method will cascade fetch corresponding histories
  search(text: string, part: Partial<INote>): Promise<INote>
}
