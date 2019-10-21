// @ts-ignore
import { Model, saga } from 'dva';
import { Suggest } from "noob-dict-core";
import { fetchSuggests } from '../service';

export interface SearchInputState {
  text: string,
  suggests: Suggest[],
  loadingSuggests: boolean,
  open: boolean,
}

export interface SearchInputModel extends Model {
  state: SearchInputState
}

const { delay } = saga;

const model: SearchInputModel = {
  namespace: 'searchInput',
  state: {
    text: '',
    suggests: [],
    loadingSuggests: false,
    open: false,
  },
  effects: {
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
      yield put({
        type: 'mergeState',
        payload: {
          suggests,
          loadingSuggests: false
        }
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
