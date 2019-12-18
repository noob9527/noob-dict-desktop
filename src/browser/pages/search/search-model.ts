import { call, put } from '@redux-saga/core/effects';
import { Model } from '../../redux/redux-model';
import { SearchUiService, SearchUiServiceToken } from '../../services/search-ui-service';
import { rendererContainer } from '../../../common/container/renderer-container';

export interface SearchState {
  pinned: boolean
}

export interface SearchModel extends Model {
  state: SearchState
}

const effects = {
  * togglePinned() {
    const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
    console.log(searchUiService);
    const pinned = yield call([searchUiService, searchUiService.togglePin]);
    console.log(pinned);
    yield put({
      type: 'search/mergeState',
      payload: { pinned },
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

const appModel: SearchModel = {
  namespace: 'search',
  state: {
    pinned: false,
  },
  effects,
  reducers,
};

export default appModel;
