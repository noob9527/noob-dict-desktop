import { put, call } from "@redux-saga/core/effects";
import { Model } from "../../redux/redux-model";
import { openSettingWindow } from "./setting-service";

export interface SettingState {
  open: boolean
}

export interface SettingModel extends Model {
  state: SettingState
}

const effects = {
  * open() {
    const open = yield call(openSettingWindow);
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
