import { Suggest } from '@noob9527/noob-dict-core';
import { call, cancel, delay, fork, put, select, take } from '@redux-saga/core/effects';
import { Model } from '../../../redux/common/redux-model';
import { rendererContainer } from '../../../../common/container/renderer-container';
import {
  CorsSearchServiceToken,
  EcDictSearchServiceToken,
  SearchService
} from '../../../../common/services/search-service';
import { RootState } from '../../root-model';
import { NoteService, LocalNoteServiceToken } from '../../../../common/services/db/note-service';
import { INote } from '../../../../common/model/note';
import { EcDictSearchService } from '../../../../electron-renderer/services/ecdict-search-service';
import logger from '../../../../electron-shared/logger';
import { EcDictSearchSuccessResult } from '@noob9527/noob-dict-ecdict';
import { TransientState } from '../../transient-model';

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
    const transientState: TransientState = yield select(state => state._transient);
    const searchService = rendererContainer.get<SearchService>(CorsSearchServiceToken);
    const ecDictSearchService = rendererContainer.get<EcDictSearchService>(EcDictSearchServiceToken);
    const noteService = rendererContainer.get<NoteService>(LocalNoteServiceToken);

    const { text } = action;
    const user_id = rootState.currentUser?.id ?? '';

    let suggests: Suggest[] = [];
    try {
      if (text) {
        if (transientState.ecDictAvailable) {
          suggests = yield call([ecDictSearchService, ecDictSearchService.fetchSuggests], text);
        } else {
          suggests = yield call([searchService, searchService.fetchSuggests], text);
        }
      } else {
        const notes: INote[] = yield call([noteService, noteService.fetchLatest], 20, user_id);
        if (transientState.ecDictAvailable) {
          const ecDictSearchResults: { [index in string]: EcDictSearchSuccessResult | null } = yield call(
            [ecDictSearchService, ecDictSearchService.fetchResultBatch],
            notes.map(e => e.text)
          );
          notes.forEach(e => {
            e.ecDictSearchResult = ecDictSearchResults[e.text] ?? null;
          });
        }
        suggests = notes.map(e => {
          return {
            entry: e.text,
            explain: e.ecDictSearchResult?.translation?.replace(/\n/g, '; '),
          };
        });
      }
    } catch (e) {
      logger.error(e);
    } finally {
      yield put({
        type: 'searchInput/mergeState',
        payload: {
          suggests,
          loadingSuggests: false,
        },
      });
    }
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
