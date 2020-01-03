import NoteService from '../../../db/note-service';
import { INote, Note } from '../../../../common/model/note';
import { call, put, select } from '@redux-saga/core/effects';
import { SearchPanelState } from '../panel/search-panel-model';
import { Model } from '../../../redux/common/redux-model';


export interface SearchToolBarState {
}

export interface SearchToolBarModel extends Model {
  state: SearchToolBarState
}

const effects = {
  * toggleCollect(action) {
    const note: Maybe<INote> = action.payload.note;
    if (note) {
      // cancel
      yield put({ type: 'searchPanel/cancelCollect', payload: { note } });
    } else {
      // collect
      yield put({ type: 'searchPanel/collect' });
    }
  },
  * cancelCollect(action) {
    const { note } = action.payload;
    yield call(NoteService.remove, note.id);
    yield put({
      type: 'searchPanel/mergeState',
      payload: { note: null },
    });
  },
  * collect(action) {
    const searchPanelState: SearchPanelState = yield select((state: any) => state.searchPanel);
    const { primaryResult } = searchPanelState;
    if (!primaryResult) {
      throw new Error('missing available result');
    }
    const note = new Note({
      text: primaryResult.target,
      searchResult: primaryResult,
    });
    yield call(NoteService.save, note);
    yield put({
      type: 'searchPanel/mergeState',
      payload: { note },
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
};

const searchToolBarModel: SearchToolBarModel = {
  namespace: 'searchToolBar',
  state: {
  },
  effects,
  reducers,
};

export default searchToolBarModel;
