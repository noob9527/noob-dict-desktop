import { Model } from '../redux/common/redux-model';
import { call, put, select } from '@redux-saga/core/effects';
import { rendererContainer } from '../../common/container/renderer-container';
import { SettingUiService, SettingUiServiceToken } from '../../common/services/setting-ui-service';
import { SearchUiService, SearchUiServiceToken } from '../../common/services/search-ui-service';

export interface TransientState {
  isSettingWindowOpen: boolean
}

interface TransientModel extends Model {
  state: TransientState
}

const state = {
  isSettingWindowOpen: false,
};

const effects = {
  * showSearchWindow() {
    const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
    yield call([searchUiService, searchUiService.showSearchWindow]);
  },
  * toggleSearchWindow() {
    const state: TransientState = yield select(state => state._transient);
    const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
    yield call(
      [searchUiService, searchUiService.toggleSearchWindow],
      { isSettingWindowOpen: state.isSettingWindowOpen },
    );
  },
  * openSettingWindow() {
    const settingUiService = rendererContainer.get<SettingUiService>(SettingUiServiceToken);
    const isSettingWindowOpen = yield call([settingUiService, settingUiService.open]);
    yield put({
      type: '_transient/mergeState',
      payload: { isSettingWindowOpen },
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

const transientModel: TransientModel = {
  namespace: '_transient',
  state,
  effects,
  reducers,
};

export default transientModel;

