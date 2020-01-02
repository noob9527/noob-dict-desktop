import { call, put, select } from '@redux-saga/core/effects';
import { Model } from '../../redux/common/redux-model';
import { SearchUiService, SearchUiServiceToken } from '../../../common/services/search-ui-service';
import { rendererContainer } from '../../../common/container/renderer-container';
import { SettingState } from '../setting/setting-model';
import { TransientState } from '../transient-model';

export interface SearchState {
  pinned: boolean
}

export interface SearchModel extends Model {
  state: SearchState
}

const effects = {
  * togglePinned() {
    const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
    const pinned = yield call([searchUiService, searchUiService.togglePin]);
    yield put({
      type: 'search/mergeState',
      payload: { pinned },
    });
  },
  * selectionTextChange(action) {
    // console.log(action);
    const settingState: SettingState = yield select(state => state.setting);
    const transientState: TransientState = yield select(state => state._transient);
    const searchState: SearchState = yield select(state => state.search);

    if (!settingState.watchSelection) return;
    if (transientState.isSettingWindowOpen) return;
    if (transientState.isSearchWindowOpen) {
      if (searchState.pinned) {
        yield put({
          type: 'searchInput/searchTextChange',
          text: action.payload.newText,
        });
        yield put({
          type: 'searchPanel/fetchResults',
          text: action.newText,
        });
      }
    }

    // todo show popup window
    // todo change search input
  },
  * clipboardTextChange(action) {
    // console.log(action);
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

const appModel: SearchModel = {
  namespace: 'search',
  state: {
    pinned: false,
  },
  effects,
  reducers,
};

export default appModel;
