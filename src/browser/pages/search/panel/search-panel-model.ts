import { EngineIdentifier, SearchResult } from 'noob-dict-core';
import { all, call, put, select } from '@redux-saga/core/effects';
import { Model } from '../../../redux/common/redux-model';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { SearchService, SearchServiceToken } from '../../../../common/services/search-service';
import { HistoryService, HistoryServiceToken } from '../../../../common/services/db/history-service';
import { push } from 'connected-react-router';

const historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);

export type SearchResultMap = { [index in EngineIdentifier]?: Maybe<SearchResult> };

export interface SearchPanelState {
  translatedText: string,
  engines: EngineIdentifier[],
  primaryResult: Maybe<SearchResult>,
  searchResultMap: SearchResultMap,
}

export interface SearchPanelModel extends Model {
  state: SearchPanelState
}

function* fetchSingleResult(action) {
  const { text, engine } = action.payload;
  const searchService = rendererContainer.get<SearchService>(SearchServiceToken);

  let result: SearchResult | null | undefined = null;

  try {
    result = yield call([searchService, searchService.fetchResult], text, { engine });
  } catch (e) {
    console.error(e);
  }

  yield put({
    type: 'searchPanel/mergeSearchResult',
    payload: {
      engine,
      result,
    },
  });
}

function* fetchResults(action) {
  const engines: EngineIdentifier[] = yield select((state: any) => state.searchPanel.engines);

  yield put({
    type: 'searchPanel/mergeState',
    payload: {
      translatedText: '',
    },
  });

  yield all([
    // fetch engines result
    ...engines.map(engine => {
      return call(fetchSingleResult, {
        type: 'searchPanel/fetchSingleResult',
        payload: {
          text: action.text,
          engine,
        },
      });
    }),
  ]);

  const searchPanelState: SearchPanelState = yield select((state: any) => state.searchPanel);
  const primaryResult = Object.values(searchPanelState.searchResultMap)
    .find(e => !!e);

  // fetch from notes
  yield put({
    type: 'searchNote/fetchOrCreateNote',
    payload: {
      text: action.text,
      part: {
        searchResult: primaryResult,
      },
    },
  });

  yield put({
    type: 'searchPanel/mergeState',
    payload: {
      translatedText: action.text,
      primaryResult: primaryResult,
    },
  });
  if (primaryResult) {
    yield put(push(`/search/engine_view/${primaryResult.engine}`));
  }
}

const effects = {
  fetchSingleResult,
  fetchResults,
};

const reducers = {
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload,
    };
  },
  mergeSearchResult(state, action: any) {
    const { engine, result } = action.payload;
    return {
      ...state,
      searchResultMap: {
        ...state.searchResultMap,
        [engine]: result,
      },
    };
  },
};

const searchPanelModel: SearchPanelModel = {
  namespace: 'searchPanel',
  state: {
    engines: [EngineIdentifier.BING, EngineIdentifier.CAMBRIDGE],
    translatedText: '',
    primaryResult: null,
    searchResultMap: {
      [EngineIdentifier.BING]: null,
      [EngineIdentifier.CAMBRIDGE]: null,
    },
  },
  effects,
  reducers,
};

export default searchPanelModel;
