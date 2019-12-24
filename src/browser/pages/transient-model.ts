import { Model } from '../redux/redux-model';
import { take, takeEvery, delay, fork } from '@redux-saga/core/effects';
import { REHYDRATE } from 'redux-persist/es/constants';

const reducers = {
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload,
    };
  },
};

const transientModel: Model = {
  namespace: '_transient',
  state: {},
  reducers,
  sagas: [watchRehydrateEvent],
};

export default transientModel;

function* watchRehydrateEvent() {
  console.log('watch rehydrate', REHYDRATE);
  yield takeEvery('persist/REHYDRATE', handleRehydrate);
  console.log('watch rehydrate end');
  // console.log('watch rehydrate', REHYDRATE);
  // while (true) {
  //   const action = yield take(REHYDRATE);
  //   console.log(action);
  //   yield delay(1000);
  //   yield fork(handleRehydrate)
  //   console.log(new Date());
  // }
}

function handleRehydrate() {
  console.log('rehydrate');
}