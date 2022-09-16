import { Model } from '../../redux/common/redux-model';
import { call, put, select } from '@redux-saga/core/effects';
import { RootState } from '../root-model';
import { rendererContainer } from '../../../common/container/renderer-container';
import { UserService, UserServiceToken } from '../../../common/services/user-service';

const userService = rendererContainer.get<UserService>(UserServiceToken);

export interface DeveloperState {
  syncHistoryPageSize: number,
  syncHistoryPageLimit: number,
}

export interface DeveloperModel extends Model {
  state: DeveloperState
}

const effects = {
  * resetSyncFlag() {
    const rootState: RootState = yield select(state => state.root);
    const { currentUser } = rootState;
    if (currentUser==null) return;

    const epoch = new Date(0);
    yield call([userService, userService.setLastEvaluatedUpdateAt], epoch);
    yield put({
      type: 'root/setLastEvaluatedUpdateAt',
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

const developerModel: DeveloperModel = {
  namespace: 'developer',
  state: {
    syncHistoryPageSize: 20,
    syncHistoryPageLimit: 5,
  },
  effects,
  reducers,
};

export default developerModel;


