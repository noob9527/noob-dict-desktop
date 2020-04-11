import { Model } from '../../../../redux/common/redux-model';
import { call, fork, put, select, take } from '@redux-saga/core/effects';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { ISearchHistory } from '../../../../../common/model/history';
import { rendererContainer } from '../../../../../common/container/renderer-container';
import {
  HistoryCreateAtSearchParam,
  HistoryService,
  HistoryServiceToken,
} from '../../../../../common/services/db/history-service';
import moment from 'moment';
import { RootState } from '../../../root-model';

const historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);

export interface OverviewState {
  searchParams: HistoryCreateAtSearchParam,
  histories: ISearchHistory[],
}

export interface OverviewModel extends Model {
  state: OverviewState
}

const state = {
  searchParams: {
    user_id: '',
    createAtBetween: {
      lowerBound: moment().subtract(1, 'years').valueOf(),
    },
  },
  histories: [],
};
const effects = {
  * fetchLatestHistories(action) {
    const rootState: RootState = yield select((state: any) => state.root);
    const overviewState: OverviewState = yield select((state: any) => state.overview);
    const { searchParams } = overviewState;
    searchParams.user_id = rootState?.currentUser?.id ?? '';
    let histories = yield call([historyService, historyService.searchByCreateAt], searchParams);
    yield put({
      type: 'overview/mergeState',
      payload: {
        histories,
      },
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

const overviewModel: OverviewModel = {
  namespace: 'overview',
  state,
  effects,
  reducers,
  sagas: [watchLocationChange],
};
export default overviewModel;

function* watchLocationChange() {
  yield fork(function* () {
    while (true) {
      const action: LocationChangeAction = yield take(LOCATION_CHANGE);
      if (action.payload.location.pathname.includes('search/overview')) {
        yield put({
          ...action,
          type: 'overview/fetchLatestHistories',
        });
      }
    }
  });
}
