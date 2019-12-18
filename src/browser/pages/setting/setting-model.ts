import { call, put } from '@redux-saga/core/effects';
import { Model } from '../../redux/redux-model';
import { SettingService, settingServiceToken } from '../../services/setting-service';
import { rendererContainer } from '../../services/renderer-container';

export interface SettingState {
  open: boolean
}

export interface SettingModel extends Model {
  state: SettingState
}

const effects = {
  * open() {
    const settingService = rendererContainer.get<SettingService>(settingServiceToken);
    const open = yield call([settingService, settingService.openSettingWindow]);
    yield put({
      type: 'setting/mergeState',
      payload: { open },
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
};

const appModel: SettingModel = {
  namespace: 'setting',
  state: {
    open: false,
  },
  effects,
  reducers,
};

export default appModel;
