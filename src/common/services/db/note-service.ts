import { INote } from '../../model/note';

export const NoteServiceToken = Symbol.for('note-service');

export interface NoteService {
  save(note: INote): Promise<INote>

  findOne(text: string): Promise<Maybe<INote>>
}
