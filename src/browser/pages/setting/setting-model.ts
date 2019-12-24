import { call, put } from '@redux-saga/core/effects';
import { Model } from '../../redux/redux-model';
import { SettingUiService, SettingUiServiceToken } from '../../services/setting-ui-service';
import { rendererContainer } from '../../../common/container/renderer-container';

export interface SettingState {
  open: boolean
  appHotKey: string
  // watchClipboard: boolean
  // watchSelection: boolean
}

export interface SettingModel extends Model {
  state: SettingState
}

const effects = {
  * open() {
    const settingUiService = rendererContainer.get<SettingUiService>(SettingUiServiceToken);
    const open = yield call([settingUiService, settingUiService.open]);
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
      ...action.payload,
    };
  },
};

const appModel: SettingModel = {
  namespace: 'setting',
  state: {
    open: false,
    appHotKey: '',
  },
  effects,
  reducers,
};

export default appModel;
