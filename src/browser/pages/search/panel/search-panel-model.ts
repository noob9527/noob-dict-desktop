import { EngineIdentifier, SearchJsonResult, SearchResult } from 'noob-dict-core';
import { all, call, put, putResolve, select } from '@redux-saga/core/effects';
import { Model } from '../../../redux/common/redux-model';
import { rendererContainer } from '../../../../common/container/renderer-container';
import { SearchService, SearchServiceToken } from '../../../../common/services/search-service';
import { HistoryService, HistoryServiceToken } from '../../../../common/services/db/history-service';
import { push } from 'connected-react-router';

const historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);

export type SearchResults = { [index in EngineIdentifier]?: Maybe<SearchJsonResult> };

export interface SearchPanelState {
  translatedText: string,
  engines: EngineIdentifier[],
  primaryResult: Maybe<SearchJsonResult>,
  searchResults: SearchResults,
}

export interface SearchPanelModel extends Model {
  state: SearchPanelState
}

const effects = {
  * fetchResults(action) {
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
        return putResolve({
          type: 'searchPanel/fetchSingleResult',
          payload: {
            text: action.text,
            engine,
          },
        });
      }),
    ]);

    const searchPanelState: SearchPanelState = yield select((state: any) => state.searchPanel);
    const primaryResult = Object.values(searchPanelState.searchResults)
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
      // switch tab
      // yield put({
      //   type: 'searchPanel/mergeState',
      //   payload: {
      //     currentTab: primaryResult.engine,
      //   },
      // });
    }
  },
  * fetchSingleResult(action) {
    const { text, engine } = action.payload;
    const searchService = rendererContainer.get<SearchService>(SearchServiceToken);
    const result: SearchJsonResult = yield call([searchService, searchService.fetchResult], text, { engine });
    yield put({
      type: 'searchPanel/mergeSearchResult',
      payload: {
        result: result,
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
  mergeSearchResult(state, action: any) {
    const result: SearchResult = action.payload.result;
    return {
      ...state,
      searchResults: {
        ...state.searchResults,
        [result.engine]: result,
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
    searchResults: {
      [EngineIdentifier.BING]: null,
      [EngineIdentifier.CAMBRIDGE]: null,
    },
  },
  effects,
  reducers,
};

export default searchPanelModel;
