import { Model } from '../redux/common/redux-model';
import { call, put } from '@redux-saga/core/effects';
import { rendererContainer } from '../../common/container/renderer-container';
import { SettingUiService, SettingUiServiceToken } from '../services/setting-ui-service';

interface TransientState {
  isSettingWindowOpen: boolean
}

interface TransientModel extends Model {
  state: TransientState
}

const state = {
  isSettingWindowOpen: false,
};

const effects = {
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

