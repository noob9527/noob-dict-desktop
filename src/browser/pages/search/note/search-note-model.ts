import { rendererContainer } from '../../../../common/container/renderer-container';
import { INote } from '../../../../common/model/note';
import { Model } from '../../../redux/common/redux-model';
import { call, put } from '@redux-saga/core/effects';
import { NoteService, NoteServiceToken } from '../../../../common/services/db/note-service';
import { ISearchHistory } from '../../../../common/model/history';

const noteService = rendererContainer.get<NoteService>(NoteServiceToken);

export interface SearchNoteState {
  noteInDb: Maybe<INote>,
  currentNote: Maybe<INote>,
  dirty: boolean, // indicates if there's any change

  histories: ISearchHistory[]
}

export interface SearchNoteModel extends Model {
  state: SearchNoteState
}

const effects = {
  // fired when user change the note
  * noteChange(action) {
    yield put({
      type: 'searchNote/mergeState',
      payload: {
        currentNote: action.note,
      },
    });
  },
  * fetchOrCreateNote(action) {
    const { text, part } = action.payload;
    let note = yield call([noteService, noteService.search], text, part);
    yield put({
      type: 'searchNote/mergeState',
      payload: {
        currentNote: note,
        noteInDb: note,
        histories: note.histories,
      },
    });
  },
};

const reducers = {
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload,
    };
  },
};

const searchNoteModel: SearchNoteModel = {
  namespace: 'searchNote',
  state: {
    noteInDb: null,
    currentNote: null,
    dirty: false,
    histories: []
  },
  effects,
  reducers,
};

export default searchNoteModel;
