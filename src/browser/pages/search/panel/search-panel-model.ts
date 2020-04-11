import { EngineIdentifier, SearchResult, SearchResults, SearchResultType } from '@noob9527/noob-dict-core';
import { all, call, put, select, take } from '@redux-saga/core/effects';
import { Model } from '../../../redux/common/redux-model';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { SearchService, SearchServiceToken } from '../../../../common/services/search-service';
import { push } from 'connected-react-router';
import { simplifyResult } from '../../../../common/model/search-domain';
import { RootState } from '../../root-model';

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

  const engines: EngineIdentifier[] = yield select((state: any) => state.searchPanel.engines);
  const rootState: RootState = yield select((state: any) => state.root);

  // reset translatedText
  yield put({
    type: 'searchPanel/mergeState',
    payload: {
      translatedText: '',
    },
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

    if (result && SearchResults.isSuccessResult(result)) {
      const history = {
        text,
        user_id: rootState.currentUser?.id ?? '',
        search_result: simplifyResult(result)
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

function getResultRank(result: SearchResult | null | undefined): number {
  if (!result) return 0;
  switch (result.type) {
    case SearchResultType.SUCCESS:
      return 30;
    case SearchResultType.DO_YOU_MEAN:
      return 20;
    case SearchResultType.EMPTY:
      return 10;
  }
}
