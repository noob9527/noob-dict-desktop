import { Suggest } from "noob-dict-core";
import { call, cancel, delay, fork, put, take } from '@redux-saga/core/effects';
import { Model } from "../../../redux/redux-model";
import { rendererContainer } from "../../../../common/container/renderer-container";
import { SearchService, SearchServiceToken } from "../../../services/search-service";

export interface SearchInputState {
  text: string,
  suggests: Suggest[],
  loadingSuggests: boolean,
  open: boolean,
}

export interface SearchInputModel extends Model {
  state: SearchInputState
}

const state = {
  text: '',
  suggests: [],
  loadingSuggests: false,
  open: false,
};

const effects = {
  // control suggests, loading suggests
  * searchTextChange(action) {
    yield put({
      type: 'searchInput/mergeState',
      payload: {
        loadingSuggests: Boolean(action.text),
      }
    });
  },
  * fetchSuggests(action) {
    const searchService = rendererContainer.get<SearchService>(SearchServiceToken);
    const suggests = yield call([searchService, searchService.fetchSuggests], action.text);
    yield put({
      type: 'searchInput/mergeState',
      payload: {
        suggests,
        loadingSuggests: false
      }
    });
  },
};

const reducers = {
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload
    };
  },
};

const model: SearchInputModel = {
  namespace: 'searchInput',
  state,
  effects,
  reducers,
  sagas: [watchSearchTextChange],
};

export default model;

function* watchSearchTextChange() {
  yield fork(function* () {
    let task;
    while (true) {
      const action = yield take('searchInput/searchTextChange');
      if (task) {
        yield cancel(task);
      }
      if (action.text) {
        task = yield fork(debouncedFetchSuggests, action);
      }
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
