import { Model } from '../../../../redux/common/redux-model';
import { call, fork, put, take, select } from '@redux-saga/core/effects';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { ISearchHistory } from '../../../../../common/model/history';
import { rendererContainer } from '../../../../../common/container/renderer-container';
import {
  HistorySearchParam,
  HistoryService,
  HistoryServiceToken,
} from '../../../../../common/services/db/history-service';
import moment from 'moment';

const historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);

export interface OverviewState {
  searchParams: HistorySearchParam,
  histories: ISearchHistory[],
}

export interface OverviewModel extends Model {
  state: OverviewState
}

const state = {
  searchParams: {
    createAtBetween: {
      lowerBound: moment().subtract(1, 'years').valueOf(),
    },
  },
  histories: [],
};
const effects = {
  * fetchLatestHistories(action) {
    const overviewState: OverviewState = yield select((state: any) => state.overview);
    const { searchParams } = overviewState;
    let histories = yield call([historyService, historyService.search], searchParams);
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