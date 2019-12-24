import { AnyAction, Reducer, ReducersMapObject } from 'redux';
import { Saga } from 'redux-saga';
import { SettingState } from '../../pages/setting/setting-model';


export interface Model {
  namespace: string
  state?: any
  reducers?: ReducersMapObject
  // effects are watched via takeEvery
  effects?: EffectsMapObject
  sagas?: Saga[]
  __unstableReducerEnhancer?: (reducer: Reducer<SettingState>) => Reducer<SettingState>
}

export type Effect = (action: AnyAction) => void;

export interface EffectsMapObject {
  [key: string]: Effect,
}
