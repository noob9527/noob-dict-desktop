import { EngineIdentifier, SearchResult } from "noob-dict-core";
import { fetchResult } from '../service';
import { injectSuppressErrorScript } from "../../../shared/utils/dom-utils";
import { Model } from "dva";
import HistoryService from '../../../shared/db/history-service';
import NoteService from '../../../shared/db/note-service';
import { History, IHistory } from "../../../shared/db/history";
import { INote } from "../../../shared/db/note";

export type SearchResults = { [index in EngineIdentifier]?: Maybe<SearchResult> };

export interface SearchPanelState {
  translatedText: string,
  note: Maybe<INote>,
  histories: IHistory[],
  currentTab: EngineIdentifier,
  engines: EngineIdentifier[],
  primaryResult: Maybe<SearchResult>,
  searchResults: SearchResults,
}

export interface SearchPanelModel extends Model {
  state: SearchPanelState
}

const searchPanelModel: SearchPanelModel = {
  namespace: 'searchPanel',
  state: {
    note: null,
    histories: [],
    currentTab: EngineIdentifier.BING,
    engines: [EngineIdentifier.BING, EngineIdentifier.CAMBRIDGE],
    translatedText: '',
    primaryResult: null,
    searchResults: {
      [EngineIdentifier.BING]: null,
      [EngineIdentifier.CAMBRIDGE]: null
    },
  },
  effects: {
    * fetchResults(action, { call, put, select, all }) {
      const engines: EngineIdentifier[] = yield select((state: any) => state.searchPanel.engines);

      yield put({
        type: 'mergeState',
        payload: {
          translatedText: '',
        }
      });
      yield all([
        // fetch engines result
        ...engines.map(engine => {
          return (put as any).resolve({
            type: 'fetchSingleResult',
            payload: {
              text: action.text,
              engine,
            },
          });
        }),
        // fetch from notes
        yield put({
          type: 'fetchNote',
          payload: {
            text: action.text,
          },
        }),
        // fetch from histories
        yield put({
          type: 'fetchHistories',
          payload: {
            text: action.text,
          },
        }),
      ]);

      const searchPanelState: SearchPanelState = yield select((state: any) => state.searchPanel);
      const primaryResult = Object.values(searchPanelState.searchResults)
        .find(e => !!e);
      yield put({
        type: 'mergeState',
        payload: {
          translatedText: action.text,
          primaryResult: primaryResult,
        }
      });
      // persist history
      if (primaryResult) {
        yield call(HistoryService.save, new History({
          text: action.text,
          searchResult: primaryResult.toJSON(),
        }));
      }
    },
    * fetchSingleResult(action, { call, put, select }) {
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
    },
    * fetchNote(action, { call, put, select }) {
      const { text } = action.payload;
      const note = yield call(NoteService.findOne, text);
      yield put({
        type: 'mergeState',
        payload: { note },
      });
    },
    * fetchHistories(action, { call, put, select }) {
      const { text } = action.payload;
      const histories = yield call(HistoryService.findAll, text);
      yield put({
        type: 'mergeState',
        payload: { histories },
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

export default searchPanelModel;
