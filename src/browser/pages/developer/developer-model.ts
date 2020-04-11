import { Model } from '../../redux/common/redux-model';
import { put, select } from '@redux-saga/core/effects';
import { RootState } from '../root-model';
import { rendererContainer } from '../../../common/container/renderer-container';
import { GlobalHistoryService, GlobalHistoryServiceToken } from '../../../common/services/global-history-service';

const globalHistoryService = rendererContainer.get<GlobalHistoryService>(GlobalHistoryServiceToken);

export interface DeveloperState {
}

export interface DeveloperModel extends Model {
  state: DeveloperState
}

const effects = {
  * resetLastSyncTime() {
    const rootState: RootState = yield select(state => state.root);
    const { currentUser } = rootState;
    if (currentUser == null) return;

    const lastSyncTime = new Date(0);
    globalHistoryService.updateLastSyncTime(lastSyncTime);
    currentUser.last_sync_time = lastSyncTime.toISOString();
    yield put({
      type: 'root/mergeState',
      payload: {
        user: currentUser
      }
    })
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
  state: {},
  effects,
  reducers,
};

export default developerModel;


