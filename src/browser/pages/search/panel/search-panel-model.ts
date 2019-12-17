import { EngineIdentifier, SearchResult } from "noob-dict-core";
import { fetchResult } from '../../../services/search-service';
import { INote } from "../../../db/note";
import { History, IHistory } from "../../../db/history";
import { all, call, put, putResolve, select } from '@redux-saga/core/effects';
import HistoryService from "../../../db/history-service";
import NoteService from "../../../db/note-service";
import { Model } from "../../../redux/redux-model";

export type SearchResults = { [index in EngineIdentifier]?: Maybe<SearchResult> };

export interface SearchPanelState {
  translatedText: string,
  note: Maybe<INote>,
  histories: IHistory[],
  currentTab: string,
  engines: EngineIdentifier[],
  primaryResult: Maybe<SearchResult>,
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
      }
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
      // fetch from notes
      yield put({
        type: 'searchPanel/fetchNote',
        payload: {
          text: action.text,
        },
      }),
      // fetch from histories
      yield put({
        type: 'searchPanel/fetchHistories',
        payload: {
          text: action.text,
        },
      }),
    ]);

    const searchPanelState: SearchPanelState = yield select((state: any) => state.searchPanel);
    const primaryResult = Object.values(searchPanelState.searchResults)
      .find(e => !!e);
    yield put({
      type: 'searchPanel/mergeState',
      payload: {
        translatedText: action.text,
        primaryResult: primaryResult,
      }
    });
    if (primaryResult) {
      // switch tab
      yield put({
        type: 'searchPanel/mergeState',
        payload: {
          currentTab: primaryResult.engine,
        }
      });
      // persist history
      yield call(HistoryService.save, new History({
        text: action.text,
        searchResult: primaryResult.toJSON(),
      }));
    }
  },
  * fetchSingleResult(action) {
    const { text, engine } = action.payload;
    const result: SearchResult = yield call(fetchResult, text, { engine });
    yield put({
      type: 'searchPanel/mergeSearchResult',
      payload: {
        result: result,
      },
    });
  },
  * fetchNote(action) {
    const { text } = action.payload;
    const note = yield call(NoteService.findOne, text);
    yield put({
      type: 'searchPanel/mergeState',
      payload: { note },
    });
  },
  * fetchHistories(action) {
    const { text } = action.payload;
    const histories = yield call(HistoryService.findAll, text);
    yield put({
      type: 'searchPanel/mergeState',
      payload: { histories },
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
    note: null,
    histories: [],
    currentTab: 'OVERVIEW',
    engines: [EngineIdentifier.BING, EngineIdentifier.CAMBRIDGE],
    translatedText: '',
    primaryResult: null,
    searchResults: {
      [EngineIdentifier.BING]: null,
      [EngineIdentifier.CAMBRIDGE]: null
    },
  },
  effects,
  reducers,
};

export default searchPanelModel;
