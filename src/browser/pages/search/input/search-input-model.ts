import { Suggest } from '@noob9527/noob-dict-core';
import { call, cancel, delay, fork, put, take, select } from '@redux-saga/core/effects';
import { Model } from '../../../redux/common/redux-model';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { SearchService, SearchServiceToken } from '../../../../common/services/search-service';
import { RootState } from '../../root-model';
import { NoteService, NoteServiceToken } from '../../../../common/services/db/note-service';

export interface SearchInputState {
  text: string,
  suggests: Suggest[],
  loadingSuggests: boolean,
  open: boolean,
}

export interface SearchInputModel extends Model {
  state: SearchInputState
}

const initState: SearchInputState = {
  text: '',
  suggests: [],
  loadingSuggests: false,
  open: false,
};

const effects = {
  // manually input search text
  * inputSearchText(action) {
    yield put({
      type: 'searchInput/mergeState',
      payload: {
        loadingSuggests: true,
      },
    });
  },
  // manually input search text or select value from suggests
  * searchTextChange(action) {
    yield put({
      type: 'searchInput/mergeState',
      payload: {
        text: action?.text,
        // reset suggests after an option is selected
        suggests: [],
      },
    });
  },
  * fetchSuggests(action) {
    const rootState: RootState = yield select(state => state.root);
    const searchService = rendererContainer.get<SearchService>(SearchServiceToken);
    const noteService = rendererContainer.get<NoteService>(NoteServiceToken);

    const { text } = action;
    const user_id = rootState.currentUser?.id ?? '';

    let suggests: Suggest[];
    if (text) {
      suggests = yield call([searchService, searchService.fetchSuggests], text);
    } else {
      const notes = yield call([noteService, noteService.fetchLatest], 20, user_id);
      suggests = notes.map(e => {
        const firstMeaning = e.search_result?.definitions[0]?.meanings[0];
        return {
          entry: e.text,
          explain: firstMeaning?.ZH ?? firstMeaning?.EN,
        };
      });
    }

    yield put({
      type: 'searchInput/mergeState',
      payload: {
        suggests,
        loadingSuggests: false,
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

const searchInputModel: SearchInputModel = {
  namespace: 'searchInput',
  state: initState,
  effects,
  reducers,
  sagas: [watchSearchTextChange],
};

export default searchInputModel;

function* watchSearchTextChange() {
  yield fork(function* () {
    let task;
    while (true) {
      const action = yield take('searchInput/inputSearchText');
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
      type: 'searchInput/fetchSuggests',
    });
  }
}
