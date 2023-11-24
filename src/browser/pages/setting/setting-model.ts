import { Model } from '../../redux/common/redux-model';
import { call, put, select } from '@redux-saga/core/effects';
import { rendererContainer } from '../../../common/container/renderer-container';
import { SettingService, SettingServiceToken } from '../../../common/services/setting-service';
import logger from '../../../electron-shared/logger';
import { UserProfile } from '../../../electron-shared/user-profile/user-profile';

export type SettingState = UserProfile;

export interface SettingModel extends Model {
  state: SettingState
}

const effects = {
  * init() {
    const settingService = rendererContainer.get<SettingService>(SettingServiceToken);
    const setting = yield call([settingService, settingService.initSetting]);
    yield put({
      type: 'setting/settingChanged',
      payload: setting,
    });
  },
  // is designed to be called by setting window
  * settingChange(action: { type: 'setting/settingChange', payload: Partial<UserProfile> }) {
    const settingService = rendererContainer.get<SettingService>(SettingServiceToken);
    const oldValue: UserProfile = yield select((state: any) => state.setting);
    const newValue: UserProfile = { ...oldValue, ...action.payload };
    logger.log('setting change', oldValue, newValue);
    const actualNewValue = yield call([settingService, settingService.sendSettingChange], newValue, oldValue);
    yield put({
      type: 'setting/settingChanged',
      payload: actualNewValue,
    });
  },
  * settingChanged(action: { type: 'setting/settingChanged', payload: UserProfile }) {
    yield put({
      type: 'setting/mergeState',
      payload: action.payload,
    });
    yield put({
      type: '_transient/setEcDictAvailable',
    });
    yield put({
      type: '_transient/setLocalDbAvailable',
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
  state: {
    appHotKey: '',
    readClipboard: false,
    watchSelection: false,
    ecDictFileLocation: null,
    dbFileLocation: null,
  },
  effects,
  reducers,
};

export default settingModel;
