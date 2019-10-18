import NoteService from '../../../shared/db/note-service';
import { Model } from "dva";
import { CollectionAction, INote, Note } from "../../../shared/db/note";
import { SearchPanelState } from "../panel/search-panel-model";


export interface SearchToolBarState {
  lastCollectAction: CollectionAction
}

export interface SearchToolBarModel extends Model {
  state: SearchToolBarState
}

const searchToolBarModel: SearchToolBarModel = {
  namespace: 'searchToolBar',
  state: {
    lastCollectAction: CollectionAction.COLLECT
  },
  effects: {
    * toggleCollect(action, { put, select }) {
      const note: Maybe<INote> = action.payload.note;
      if (note) {
        // cancel
        yield put({ type: 'cancelCollect', payload: { note } });
      } else {
        // collect
        yield put({ type: 'collect' });
      }
    },
    * cancelCollect(action, { call, put }) {
      const { note } = action.payload;
      yield call(NoteService.remove, note.id);
      yield put({
        type: 'searchPanel/mergeState',
        payload: { note: null },
      });
    },
    * collect(action, { put, select, call }) {
      const searchPanelState: SearchPanelState = yield select((state: any) => state.searchPanel);
      const lastCollectAction = yield select((state: any) => state.searchToolBar.lastCollectAction);
      const { primaryResult } = searchPanelState;
      if (!primaryResult) {
        throw new Error('missing available result')
      }
      const note = new Note({
        text: primaryResult.target,
        collectAction: lastCollectAction,
        searchResult: primaryResult.toJSON(),
      });
      yield call(NoteService.save, note);
      yield put({
        type: 'searchPanel/mergeState',
        payload: { note },
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
  },
};

export default searchToolBarModel;
