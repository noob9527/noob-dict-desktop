import { Model } from '../redux/redux-model';
import { takeEvery } from '@redux-saga/core/effects';
import { REHYDRATE } from 'redux-persist/es/constants';

interface TransientState {

}

interface TransientModel extends Model {

}

const state = {};

const effects = {};

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
  state,
  reducers,
  sagas: [watchRehydrateEvent],
};

export default transientModel;

function* watchRehydrateEvent() {
  console.debug('watch rehydrate action', REHYDRATE);
  yield takeEvery(REHYDRATE, handleRehydrate);
}

function* handleRehydrate() {
  console.log('rehydrate');
}