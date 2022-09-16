import { injectable } from 'inversify';
import { NoteService } from '../../../../common/services/db/note-service';
import logger from '../../../../electron-shared/logger';
import { ISearchHistory } from '../../../../common/model/history';
import { INote, Note } from '../../../../common/model/note';

@injectable()
export class MockNoteService implements NoteService {
  private log = logger.getLogger(MockNoteService.name);

  addHistory(history: ISearchHistory): Promise<INote> {
    this.log.log(history);
    return Promise.resolve(Note.create({}));
  }

  fetch(text: string, user_id: string): Promise<Maybe<INote>> {
    this.log.log(text, user_id);
    return Promise.resolve(undefined);
  }

  fetchLatest(limit: number, user_id: string): Promise<INote[]> {
    this.log.log(limit, user_id);
    return Promise.resolve([]);
  }

  syncHistory(history: ISearchHistory): Promise<void> {
    this.log.log(history);
    return Promise.resolve(undefined);
  }

}
