// @ts-ignore
import { Model, saga } from 'dva';
import { fetchHtml, fetchSuggests } from './service';
import { EngineIdentifier, SearchResult, Suggest } from "noob-dict-core";

const { delay } = saga;

const model: Model = {
  namespace: 'search',
  state: {
    text: '',
    suggests: [] as Suggest[],
    searchResults: [] as [EngineIdentifier, SearchResult][],
    htmls: [] as [EngineIdentifier, string][],
  },
  effects: {
    * textChange(action, { put }) {
      yield put({
        type: 'mergeState',
        payload: {
          text: action.text
        }
      });
    },
    * searchTextChange(action, { put }) {
      yield put({
        type: 'debouncedFetchSuggests',
        text: action.text
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
      yield put({
        type: 'mergeState',
        payload: {
          suggests
        }
      });
    },
    * fetchHtml(action, { call, put }) {
      const html = yield call(fetchHtml, action.text, EngineIdentifier.CAMBRIDGE);
      yield put({
        type: 'mergeState',
        payload: {
          htmls: [[EngineIdentifier.CAMBRIDGE, html]],
        },
      });
    },
  },
  reducers: {
    mergeState(state, action: any) {
      return {
        ...state,
        ...action.payload
      };
    },
  }
};

export default model;
