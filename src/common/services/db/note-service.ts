import { INote } from '../../model/note';
import { type ISearchHistory } from '../../model/history';

// used in renderer process
export const DexieNoteServiceToken = Symbol.for('dexie-note-service');

// used in renderer process
export const LocalNoteServiceToken = Symbol.for('local-note-service');

// used in main process
export const MainNoteServiceToken = Symbol.for('main-note-service');

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

  // if history is new, call addHistory
  // else just update history
  syncHistory(history: ISearchHistory): Promise<void>

  // addHistories(histories: ISearchHistory[]): Promise<ISearchHistory[]>
}
