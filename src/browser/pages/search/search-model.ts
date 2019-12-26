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
  * clipboardTextChange(action) {
    console.log(action);
    const settingState: SettingState = yield select(state => state.setting);
    const transientState: TransientState = yield select(state => state.transient);

    if (transientState.isSettingWindowOpen) return;
    if (!settingState.watchClipboard) return;
    // todo change search input
  },
  * selectionTextChange(action) {
    console.log(action);
    const settingState: SettingState = yield select(state => state.setting);
    const transientState: TransientState = yield select(state => state.transient);

    if (transientState.isSettingWindowOpen) return;
    if (!settingState.watchClipboard) return;
    // todo show popup window
    // todo change search input
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
