import { Model } from '../../../../redux/common/redux-model';
import { call, fork, take } from '@redux-saga/core/effects';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { ISearchHistory } from '../../../../../common/model/history';
import { rendererContainer } from '../../../../../common/container/renderer-container';
import { HistoryService, HistoryServiceToken } from '../../../../../common/services/db/history-service';

const historyService = rendererContainer.get<HistoryService>(HistoryServiceToken);

export interface OverviewState {
  histories: ISearchHistory[],
}

export interface OverviewModel extends Model {
  state: OverviewState
}

const state = {
  histories: [],
};
const effects = {
  * fetchLatestHistories(action) {
    // let note = yield call([noteService, noteService.search], text, part);

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
        console.log(action);
      }
    }
  });
}
