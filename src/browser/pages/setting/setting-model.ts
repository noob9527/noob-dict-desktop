import { Model } from '../../redux/common/redux-model';
import { call, put, select } from '@redux-saga/core/effects';
import { rendererContainer } from '../../../common/container/renderer-container';
import { SettingService, SettingServiceToken } from '../../../common/services/setting-service';

export interface SettingState {
  appHotKey: string
  readClipboard: boolean
  watchSelection: boolean
}

export interface SettingModel extends Model {
  state: SettingState
}

const state = {
  appHotKey: '',
  readClipboard: false,
  watchSelection: false,
};

const effects = {
  * init() {
    const settingService = rendererContainer.get<SettingService>(SettingServiceToken);
    const setting = yield call([settingService, settingService.initSetting]);
    yield put({
      type: 'setting/mergeState',
      payload: setting,
    });
  },
  // is designed to be called by setting window
  * settingChange(action) {
    const settingService = rendererContainer.get<SettingService>(SettingServiceToken);
    const oldValue = yield select((state: any) => state.setting);
    const newValue = { ...oldValue, ...action.payload };
    const actualNewValue = yield call([settingService, settingService.sendSettingChange], newValue, oldValue);
    yield put({
      type: 'setting/mergeState',
      payload: actualNewValue,
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

const settingModel: SettingModel = {
  namespace: 'setting',
  state,
  effects,
  reducers,
};

export default settingModel;
