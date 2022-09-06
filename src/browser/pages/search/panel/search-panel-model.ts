import { SearchEmptyResult, SearchResult, SearchResultType } from '@noob9527/noob-dict-core';
import { NetworkEngineId } from '@noob9527/noob-dict-net-engines';
import { all, call, put, select, take } from '@redux-saga/core/effects';
import { Model } from '../../../redux/common/redux-model';
import { rendererContainer } from '../../../../common/container/renderer-container';
import {
  SearchService,
  CorsSearchServiceToken,
  EcDictSearchServiceToken,
  EcDictId
} from '../../../../common/services/search-service';
import { push } from 'connected-react-router';
import { RootState } from '../../root-model';
import { EcDictSearchService } from '../../../../electron-renderer/services/ecdict-search-service';
import { EcDictSearchSuccessResult } from '@noob9527/noob-dict-ecdict';

export interface SearchResultMap {
  [NetworkEngineId.BING]?: Maybe<SearchResult>,
  [NetworkEngineId.CAMBRIDGE]?: Maybe<SearchResult>,
}

export interface SearchPanelState {
  translatedText: string
  engines: string[]
  primaryResult: Maybe<SearchResult>
  searchResultMap: SearchResultMap
  ecDictSearchResult: EcDictSearchSuccessResult | SearchEmptyResult | null
  highlightWords: string[],
}

export interface SearchPanelModel extends Model {
  state: SearchPanelState
}

function* fetchEcDictResult(action) {
  const { text, engine } = action.payload;
  const ecDictSearchService = rendererContainer.get<EcDictSearchService>(EcDictSearchServiceToken);
  let result: EcDictSearchSuccessResult | SearchEmptyResult | null = null;
  try {
    result = yield call([ecDictSearchService, ecDictSearchService.fetchResult], text, { engine });
  } catch (e) {
    console.error(e);
  }

  yield put({
    type: 'searchPanel/fetchEcDictResultFinished',
    payload: {
      ecDictSearchResult: result,
    },
  });
}

function* fetchSingleResult(action) {
  const { text, engine } = action.payload;
  const searchService = rendererContainer.get<SearchService>(CorsSearchServiceToken);

  let result: SearchResult | null | undefined = null;

  try {
    result = yield call([searchService, searchService.fetchResult], text, { engine });
  } catch (e) {
    console.error(e);
  }

  yield put({
    type: 'searchPanel/fetchSingleResultFinished',
    payload: {
      engine,
      result,
    },
  });
}

interface FetchResultsAction {
  text: string
}

function* fetchResults(action: FetchResultsAction) {
  const { text } = action;
  if (!text.trim()) return;

  const engines: NetworkEngineId[] = yield select((state: any) => state.searchPanel.engines);
  const rootState: RootState = yield select((state: any) => state.root);

  // reset translatedText
  yield put({
    type: 'searchPanel/clearPreviousResult',
  });

  yield all([
    // fetch engines result
    ...engines.map(engine => {
      return put({
        type: 'searchPanel/fetchSingleResult',
        payload: {
          text,
          engine,
        },
      });
    }),
    put({
      type: 'searchPanel/fetchEcDictResult',
      payload: {
        text,
        engine: EcDictId,
      },
    }),
  ]);

  // try to pick the most useful result
  let primaryResult: SearchResult | null | undefined = null;
  let primaryResultRank = 0;

  for (let finishedCount = 0; finishedCount < engines.length; finishedCount++) {
    const finishedAction = yield take('searchPanel/fetchSingleResultFinished');
    const result = finishedAction?.payload?.result;

    const resultRank = getResultRank(result);
    if (resultRank > primaryResultRank) {
      primaryResultRank = resultRank;
      primaryResult = result;
    }

    if (result && SearchResultType.isSuccessResult(result)) {
      const history = {
        text,
        user_id: rootState.currentUser?.id ?? '',
      };
      // fetch from notes
      yield put({
        type: 'searchNote/fetchOrCreateNote',
        payload: { history },
      });
      yield put(push(`/search/engine_view/${result.engine}`));
      break;
    }
  }

  yield put({
    type: 'searchPanel/mergeState',
    payload: {
      translatedText: text,
      primaryResult,
    },
  });
}

const effects = {
  fetchSingleResult,
  fetchResults,
  fetchEcDictResult,
};

const reducers = {
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload,
    };
  },
  fetchSingleResultFinished(state, action: any) {
    const { engine, result } = action.payload;
    return {
      ...state,
      searchResultMap: {
        ...state.searchResultMap,
        [engine]: result,
      },
      highlightWords: Array.from(new Set(state.highlightWords.concat(getHighlightWords(result)))),
    };
  },
  fetchEcDictResultFinished(state, action: any) {
    const result = action.payload.ecDictSearchResult;
    return {
      ...state,
      ecDictSearchResult: result,
      highlightWords: Array.from(new Set(state.highlightWords.concat(getHighlightWords(result)))),
    };
  },
  clearPreviousResult(state) {
    return {
      ...state,
      translatedText: '',
      primaryResult: null,
      ecDictSearchResult: null,
      searchResultMap: {
        [NetworkEngineId.BING]: null,
        [NetworkEngineId.CAMBRIDGE]: null,
      },
      highlightWords: [],
    };
  },
};

const searchPanelModel: SearchPanelModel = {
  namespace: 'searchPanel',
  state: {
    engines: [NetworkEngineId.BING, NetworkEngineId.CAMBRIDGE],
    translatedText: '',
    primaryResult: null,
    ecDictSearchResult: null,
    searchResultMap: {
      [NetworkEngineId.BING]: null,
      [NetworkEngineId.CAMBRIDGE]: null,
    },
    highlightWords: [],
  },
  effects,
  reducers,
};

export default searchPanelModel;

function getResultRank(result: SearchResult | null | undefined): number {
  if (!result) return 0;
  let res = 0;
  switch (result.type) {
    case SearchResultType.Constant.SUCCESS:
      res += 300;
      break;
    case SearchResultType.Constant.DO_YOU_MEAN:
      res += 200;
      break;
    case SearchResultType.Constant.EMPTY:
      res += 100;
      break;
  }
  switch (result.engine) {
    case NetworkEngineId.BING:
      res += 90;
      break;
    case NetworkEngineId.CAMBRIDGE:
      res += 80;
      break;
  }
  return res;
}

function getHighlightWords(result: SearchResult | null | undefined): string[] {
  if (!result) return [];
  if (!SearchResultType.isSuccessResult(result)) return [];
  return [
    result.target,
    result.title!!,
    ...Object.values(result.wordForms) as string[]
  ];
}
