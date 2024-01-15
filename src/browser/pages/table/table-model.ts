import { Model } from '../../redux/common/redux-model';
import { rendererContainer } from '../../../common/container/renderer-container';
import { NoteService, LocalNoteServiceToken } from '../../../common/services/db/note-service';
import { HistoryParam, HistoryService, LocalHistoryServiceToken } from '../../../common/services/db/history-service';
import { type ISearchHistory } from '../../../common/model/history';
import { call, delay, put, select } from '@redux-saga/core/effects';
import { RootState } from '../root-model';
import { DataWrapper } from '../../../common/model/data-wrapper';
import { Page } from '../../../common/model/page';
import { SearchNoteState } from '../search/note/search-note-model';

const noteService = rendererContainer.get<NoteService>(LocalNoteServiceToken);
const historyService = rendererContainer.get<HistoryService>(LocalHistoryServiceToken);

export interface TableState {
  historyParam: HistoryParam,
  totalCount: number,
  histories: {
    [index: number]: DataWrapper<ISearchHistory>
  }
  loading: boolean
}

const initState: TableState = {
  loading: false,
  historyParam: {
    page: 1,
    size: 50,
    user_id: '',
    textLike: null,
    sourceLike: null,
  },
  totalCount: 0,
  histories: {},
};

export interface TableModel extends Model {
  state: TableState
}

const effects = {
  * changeHistoryParams(action) {
    const { payload } = action;
    yield put({
      type: 'table/mergeState',
      payload: {
        historyParam: payload,
      },
    });
    yield put({ type: 'table/fetchHistories' });
  },
  * fetchHistories() {
    const rootState: RootState = yield select((state: any) => state.root);
    const table: TableState = yield select(state => state.table);
    const param = table.historyParam;
    param.user_id = rootState?.currentUser?.id ?? '';

    yield put({
      type: 'table/mergeState',
      payload: {
        loading: true,
        histories: {},
      },
    });

    let page: Page<ISearchHistory> = yield call([historyService, historyService.list], param);
    let histories = page.items.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id!!]: {
          id: curr.id,
          typing: false,
          editing: false,
          dirty: false,
          syncing: false,
          showSpinner: false,
          oldData: curr,
          newData: curr,
        },
      };
    }, {});

    yield put({
      type: 'table/mergeState',
      payload: {
        loading: false,
        totalCount: page.totalCount,
        histories,
      },
    });
  },
  * syncHistoryContext(action) {
    const { history_id } = action.payload;
    const histories = yield select(state => state.table.histories);
    const wrapper = histories[history_id];
    const history = wrapper.newData;

    yield put({
      type: 'table/startSyncHistoryContext',
      payload: {
        history_id,
      },
    });

    yield call([historyService, historyService.update], history, true);

    yield put({
      type: 'table/finishSyncHistoryContext',
      payload: {
        history,
      },
    });

    // we do not hide spinner during finish event
    yield delay(1000);
    yield put({
      type: 'table/hideSpinner',
      payload: {
        history,
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
  changeEditing(state: SearchNoteState, action) {
    const { payload } = action;
    const histories = {
      ...state.histories,
      [payload.id]: {
        ...state.histories[payload.id],
        editing: payload.editing,
      },
    };
    return {
      ...state,
      histories,
    };
  },
  startSyncHistoryContext(state, action) {
    const { history_id } = action.payload;
    const wrapper = state.histories[history_id];
    const histories = {
      ...state.histories,
      [history_id]: {
        ...wrapper,
        typing: false,
        syncing: true,
        showSpinner: true,
      },
    };
    return {
      ...state,
      histories,
    };
  },
  finishSyncHistoryContext(state, action) {
    const { history } = action.payload;
    const wrapper = state.histories[history.id];
    const histories = {
      ...state.histories,
      [history.id]: {
        ...wrapper,
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
  // change 'newData'
  changeHistory(state, action) {
    const { history } = action.payload;
    const oldHistoryWrapper = state.histories[history.id];
    const histories = {
      ...state.histories,
      [history.id]: {
        ...oldHistoryWrapper,
        newData: {
          ...oldHistoryWrapper.oldData,
          ...history,
        },
      },
    };
    return {
      ...state,
      histories,
    };
  },
  cancelChangeHistory(state, action) {
    const { history_id } = action.payload;
    const wrapper = state.histories[history_id];
    const histories = {
      ...state.histories,
      [history_id]: {
        ...wrapper,
        newData: wrapper.oldData,
      },
    };
    return {
      ...state,
      histories,
    };
  },
};

const tableModel: TableModel = {
  namespace: 'table',
  state: initState,
  effects,
  reducers,
};

export { tableModel };

