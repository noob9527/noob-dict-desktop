// @ts-ignore
import { saga } from 'dva';
import { EngineIdentifier, SearchResult } from "noob-dict-core";
import { fetchResult, fetchSuggests } from './service';
import { SearchModel, SearchState } from "./search-domain";
import { injectSuppressErrorScript } from "../../shared/utils/dom-utils";

const { delay } = saga;

const model: SearchModel = {
  namespace: 'search',
  state: {
    text: '',
    suggests: [],
    loadingSuggests: false,
    engines: [EngineIdentifier.BING, EngineIdentifier.CAMBRIDGE],
    searchResults: {
      [EngineIdentifier.BING]: null,
      [EngineIdentifier.CAMBRIDGE]: null
    },
  },
  effects: {
    // update text in time
    * textChange(action, { put }) {
      yield put({
        type: 'mergeState',
        payload: {
          text: action.text,
          suggests: [],
        }
      });
    },
    // control suggests, loading suggests
    * searchTextChange(action, { put }) {
      if (action.text) {
        yield put({
          type: 'debouncedFetchSuggests',
          text: action.text
        });
      }
      yield put({
        type: 'mergeState',
        payload: {
          loadingSuggests: Boolean(action.text),
        }
      });
    },
    debouncedFetchSuggests: [
      function* (action, { put }) {
        yield delay(300);
        yield put({
          ...action,
          type: 'fetchSuggests',
        });
      }, { type: "takeLatest" }
    ],
    * fetchSuggests(action, { call, put }) {
      const suggests = yield call(fetchSuggests, action.text);
      console.log(suggests);
      yield put({
        type: 'mergeState',
        payload: {
          suggests,
          loadingSuggests: false
        }
      });
    },
    * fetchResults(action, { call, put, select, all }) {
      const engines: EngineIdentifier[] = yield select((state: any) => state.search.engines);
      console.log(`search: ${action.text}`);
      yield all(engines.map(engine => {
        return put({
          type: 'fetchSingleResult',
          payload: {
            text: action.text,
            engine,
          },
        });
      }));
    },
    * fetchSingleResult(action, { call, put }) {
      const { text, engine } = action.payload;
      const result: SearchResult = yield call(fetchResult, text, { engine });
      const processedResult = {
        ...result,
        html: injectSuppressErrorScript(result.html),
      };
      yield put({
        type: 'mergeSearchResult',
        payload: {
          result: processedResult,
        },
      });
    }
  },
  reducers: {
    mergeState(state, action: any) {
      return {
        ...state,
        ...action.payload
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
  }
};

export default model;
