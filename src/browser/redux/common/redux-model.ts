import { AnyAction, Reducer, ReducersMapObject } from 'redux';
import { Saga } from 'redux-saga';
import { UserProfile } from '../../../common/model/user-profile';


export interface Model {
  namespace: string
  state?: any
  reducers?: ReducersMapObject
  // effects are watched via takeEvery
  effects?: EffectsMapObject
  sagas?: Saga[]
  __unstableReducerEnhancer?: (reducer: Reducer<UserProfile>) => Reducer<UserProfile>
}

export type Effect<T extends AnyAction> = (action: T) => void;

export interface EffectsMapObject {
  [key: string]: Effect<any>,
}
