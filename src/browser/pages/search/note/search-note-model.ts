import { rendererContainer } from '../../../../common/container/renderer-container';
import { INote } from '../../../../common/model/note';
import { Model } from '../../../redux/common/redux-model';
import { all, call, cancel, delay, fork, put, take, select } from '@redux-saga/core/effects';
import { NoteService, NoteServiceToken } from '../../../../common/services/db/note-service';
import { ISearchHistory } from '../../../../common/model/history';
import { HistoryService, HistoryServiceToken } from '../../../../common/services/db/history-service';

const noteService = rendererContainer.get<NoteService>(NoteServiceToken);
const historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);

export interface DataWrapper<T> {
  id: number,
  typing: boolean,
  dirty: boolean,
  syncing: boolean,
  oldData: T,
  newData: T,
}

export interface SearchNoteState {
  noteInDb: Maybe<INote>,
  currentNote: Maybe<INote>,
  dirty: boolean, // indicates if there's any change
  histories: {
    [index: number]: DataWrapper<ISearchHistory>
  }
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
    const histories = note.histories.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: {
          id: curr.id,
          typing: false,
          dirty: false,
          syncing: false,
          oldData: curr,
          newData: curr
        }
      };
    }, {});
    yield put({
      type: 'searchNote/mergeState',
      payload: {
        currentNote: note,
        noteInDb: note,
        histories,
      },
    });
  },
  * syncHistoryContext(action) {
    const { history } = action.payload;

    const searchNoteState: SearchNoteState = yield select(e => e.searchNote);
    if (!searchNoteState.histories[history.id].dirty) return;

    yield put({
      type: 'searchNote/startSyncHistoryContext',
      payload: {
        history
      },
    });
    yield all([
      call([historyService, historyService.update], history),
      // to show the spinner...
      delay(1000)
    ]);
    // yield call([historyService, historyService.update], history);
    yield put({
      type: 'searchNote/finishSyncHistoryContext',
      payload: {
        history
      },
    });
  }
};

const reducers = {
  startSyncHistoryContext(state, action) {
    const { history } = action.payload;
    const oldHistoryWrapper = state.histories[history.id];
    const histories = {
      ...state.histories,
      [history.id]: {
        ...oldHistoryWrapper,
        typing: false,
        syncing: true,
        newData: history,
      }
    };
    return {
      ...state,
      histories,
    };
  },
  finishSyncHistoryContext(state, action) {
    const { history } = action.payload;
    const oldHistoryWrapper = state.histories[history.id];
    const histories = {
      ...state.histories,
      [history.id]: {
        ...oldHistoryWrapper,
        typing: false,
        syncing: false,
        dirty: false,
        oldData: history,
        newData: history,
      }
    };
    return {
      ...state,
      histories,
    };
  },
  typeHistoryContext(state, action) {
    const { history } = action.payload;
    const oldHistoryWrapper = state.histories[history.id];
    const histories = {
      ...state.histories,
      [history.id]: {
        ...oldHistoryWrapper,
        typing: true,
        dirty: history?.context?.paragraph !== oldHistoryWrapper?.context?.paragraph,
        syncing: false,
        oldData: state.histories[history.id].oldData,
        newData: history,
      }
    };
    return {
      ...state,
      histories,
    };
  },
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
    histories: {}
  },
  effects,
  reducers,
  sagas: [watchTypeContext],
};

export default searchNoteModel;

function* watchTypeContext() {
  yield fork(function* () {
    let task;
    while (true) {
      const action = yield take('searchNote/typeHistoryContext');
      if (task) {
        yield cancel(task);
      }
      task = yield fork(debounced, action);
    }
  });

  function* debounced(action) {
    yield delay(1000);
    yield put({
      ...action,
      type: 'searchNote/syncHistoryContext',
    });
  }
}
