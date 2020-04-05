import { INote } from '../../model/note';
import { ISearchHistory } from '../../model/history';

export const NoteServiceToken = Symbol.for('note-service');

export interface NoteService {
  // cascade fetch corresponding histories
  fetch(text: string, user_id: string): Promise<Maybe<INote>>

  fetchLatest(limit: number, user_id: string): Promise<INote[]>

  // if the note is not present
  // create one based on the second argument
  // else the second argument is ignored
  // note: this method also add a search history to histories fields
  // this method will cascade fetch corresponding histories
  addHistory(history: ISearchHistory): Promise<INote>

  // addHistories(histories: ISearchHistory[]): Promise<ISearchHistory[]>
}
