import { rendererContainer } from '../../../../common/container/renderer-container';
import { INote } from '../../../../common/model/note';
import { Model } from '../../../redux/common/redux-model';
import { all, call, cancel, delay, fork, put, select, take } from '@redux-saga/core/effects';
import { NoteService, NoteServiceToken } from '../../../../common/services/db/note-service';
import { ISearchHistory } from '../../../../common/model/history';
import { HistoryService, HistoryServiceToken } from '../../../../common/services/db/history-service';
import _ from 'lodash';
import { RootState } from '../../root-model';

const noteService = rendererContainer.get<NoteService>(NoteServiceToken);
const historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);

export interface DataWrapper<T> {
  id: number,
  editing: boolean,
  typing: boolean,
  dirty: boolean,
  syncing: boolean,
  showSpinner: boolean,
  oldData: T,
  newData: T,
}

export interface SearchNoteState {
  noteInDb: Maybe<INote>,
  suggests: string[],
  loadingSuggests: boolean,
  histories: {
    [index: number]: DataWrapper<ISearchHistory>
  }
}

export interface SearchNoteModel extends Model {
  state: SearchNoteState
}

const state: SearchNoteState = {
  suggests: [],
  loadingSuggests: false,
  noteInDb: null,
  histories: {},
};

const effects = {
  * fetchOrCreateNote(action) {
    const { history } = action.payload;
    let note = yield call([noteService, noteService.addHistory], history);
    const histories = note.histories.reduce((acc, curr, i, arr) => {
      return {
        ...acc,
        [curr.id]: {
          id: curr.id,
          typing: false,
          editing: i === arr.length - 1,
          dirty: false,
          syncing: false,
          showSpinner: false,
          oldData: curr,
          newData: curr,
        },
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

    // somehow this may cause lost update
    // const searchNoteState: SearchNoteState = yield select(e => e.searchNote);
    // if (!searchNoteState.histories[history.id].dirty) return;

    yield put({
      type: 'searchNote/startSyncHistoryContext',
      payload: {
        history,
      },
    });
    // yield all([
    //   call([historyService, historyService.update], history),
    //   // to show the spinner...
    //   delay(1000),
    // ]);
    yield call([historyService, historyService.update], history);

    yield put({
      type: 'searchNote/finishSyncHistoryContext',
      payload: {
        history,
      },
    });

    // we do not hide spinner during finish event
    yield delay(1000);
    yield put({
      type: 'searchNote/hideSpinner',
      payload: {
        history,
      },
    });
  },
  * saveExampleToContext(action) {
    const { paragraph } = action.payload;
    const searchNoteState: SearchNoteState = yield select(e => e.searchNote);
    const latest: DataWrapper<ISearchHistory> | undefined = _.maxBy(
      Object.values(searchNoteState.histories),
      e => e.id,
    );
    if (!latest) return;

    yield put({
      type: 'searchNote/typeHistoryContext',
      payload: {
        history: {
          ...latest.oldData,
          context: {
            ...latest.oldData.context,
            paragraph,
          },
        },
      },
    });
  },
  // manually input search text
  * inputSearchText(action) {
    yield put({
      type: 'searchNote/mergeState',
      payload: {
        loadingSuggests: true,
      },
    });
  },
  // manually input search text or select value from suggests
  * searchTextChange(action) {
    yield put({
      type: 'searchNote/mergeState',
      payload: {
        text: action?.text,
        // reset suggests after an option is selected
        suggests: [],
      },
    });
  },
  * fetchSuggests(action) {
    const rootState: RootState = yield select(state => state.root);
    const historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);
    const suggests = yield call([historyService, historyService.fetchSourceSuggest], action.text, rootState.currentUser?.id ?? '');
    yield put({
      type: 'searchNote/mergeState',
      payload: {
        suggests,
        loadingSuggests: false,
      },
    });
  },
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
        showSpinner: true,
        newData: history,
      },
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
      },
    };
    return {
      ...state,
      histories,
    };
  },
  hideSpinner(state, action) {
    const { history } = action.payload;
    const oldHistoryWrapper = state.histories[history.id];
    const histories = {
      ...state.histories,
      [history.id]: {
        ...oldHistoryWrapper,
        showSpinner: false,
      },
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
        dirty: history?.context?.paragraph !== oldHistoryWrapper?.context?.paragraph
          || history?.context?.source !== oldHistoryWrapper?.context?.source,
        syncing: false,
        // oldData: state.histories[history.id].oldData,
        newData: history,
      },
    };
    return {
      ...state,
      histories,
    };
  },
  changeEditing(state: SearchNoteState, action) {
    const { payload } = action;
    const histories = { ...state.histories };
    const current = _.maxBy(Object.values(histories), e => e.oldData.create_at);
    Object.values(histories).forEach(e => {
      e.editing = e.id === payload.id
        // if it is the first element, we force the editing state
        || e.id === current?.id;
    });
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
  state,
  effects,
  reducers,
  sagas: [watchTypeContext, watchSearchTextChange],
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

function* watchSearchTextChange() {
  yield fork(function* () {
    let task;
    while (true) {
      const action = yield take('searchNote/inputSearchText');
      if (task) {
        yield cancel(task);
      }
      task = yield fork(debouncedFetchSuggests, action);
    }
  });

  function* debouncedFetchSuggests(action) {
    yield delay(300);
    yield put({
      ...action,
      type: 'searchNote/fetchSuggests',
    });
  }
}
