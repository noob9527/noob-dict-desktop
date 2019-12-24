import { Model } from '../../redux/common/redux-model';
import { Reducer } from 'redux';
import { persistReducer } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/es/constants';
import { takeEvery } from '@redux-saga/core/effects';
import { settingPersistConfig } from '../../redux/redux-persist-store-enhancer';
// import storageSession from 'redux-persist/lib/storage/session';
// import storage from 'redux-persist/lib/storage';

export interface SettingState {
  appHotKey: string
  watchClipboard: boolean
  watchSelection: boolean
}

export interface SettingModel extends Model {
  state: SettingState
}

const state = {
  appHotKey: '',
  watchClipboard: false,
  watchSelection: false,
};

const effects = {};

const reducers = {
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload,
    };
  },
};

function __unstableReducerEnhancer(reducer: Reducer) {
  // see https://github.com/rt2zz/redux-persist#nested-persists
  return persistReducer(settingPersistConfig, reducer);
}

const settingModel: SettingModel = {
  namespace: 'setting',
  state,
  effects,
  reducers,
  sagas: [watchRehydrateEvent],
  __unstableReducerEnhancer,
};

export default settingModel;

function* watchRehydrateEvent() {
  console.debug('watch rehydrate action', REHYDRATE);
  yield takeEvery(REHYDRATE, handleRehydrate);
}

function* handleRehydrate() {
  console.debug('rehydrate');
}
