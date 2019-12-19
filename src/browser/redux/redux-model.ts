import { AnyAction, ReducersMapObject } from 'redux';
import { Saga } from 'redux-saga';


export interface Model {
  namespace: string
  state?: any
  reducers?: ReducersMapObject
  // effects are watched via takeEvery
  effects?: EffectsMapObject
  sagas?: Saga[]
}

export type Effect = (action: AnyAction) => void;

export interface EffectsMapObject {
  [key: string]: Effect,
}
