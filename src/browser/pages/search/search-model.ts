import { call, cancel, delay, fork, put, select, take } from '@redux-saga/core/effects';
import { Model } from '../../redux/common/redux-model';
import { SearchUiService, SearchUiServiceToken } from '../../../common/services/search-ui-service';
import { rendererContainer } from '../../../common/container/renderer-container';
import { SettingState } from '../setting/setting-model';
import { TransientState } from '../transient-model';

export const SPLIT_PANE_SIZE_MAX = 450;
export const SPLIT_PANE_SIZE_MIN = 60;
export const SPLIT_PANE_SIZE_MIDDLE = (400 + 60) / 2;

export interface SearchState {
  pinned: boolean
  splitPaneSize: number
  splitPaneButtonUp: boolean
}

export interface SearchModel extends Model {
  state: SearchState
}

const effects = {
  * togglePinned() {
    const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
    const pinned = yield call([searchUiService, searchUiService.togglePin]);
    yield put({
      type: 'search/mergeState',
      payload: { pinned },
    });
  },
  * debouncedSelectionTextChange(action) {
    const settingState: SettingState = yield select(state => state.setting);
    const transientState: TransientState = yield select(state => state._transient);
    const searchState: SearchState = yield select(state => state.search);

    if (!settingState.watchSelection) return;
    if (transientState.isSettingWindowOpen) return;
    if (transientState.isSearchWindowOpen) {
      if (searchState.pinned) {
        yield put({
          type: 'searchInput/searchTextChange',
          text: action.payload.newText,
        });
        yield put({
          type: 'searchPanel/fetchResults',
          text: action.payload.newText,
        });
      }
    }
  },
  * clipboardTextChange(action) {
    // console.log(action);
  },
};

const reducers = {
  mergeState(state, action: any) {
    console.log(action);
    return {
      ...state,
      ...action.payload,
    };
  },
  updatePanelSize(state, action: any) {
    const { splitPaneSize } = action.payload;
    return {
      ...state,
      splitPaneSize,
      splitPaneButtonUp: splitPaneSize <= SPLIT_PANE_SIZE_MIDDLE,
    };
  },
  togglePaneSize(state) {
    const { splitPaneButtonUp } = state;
    const splitPaneSize = splitPaneButtonUp ? SPLIT_PANE_SIZE_MAX : SPLIT_PANE_SIZE_MIN;
    return {
      ...state,
      splitPaneSize,
      splitPaneButtonUp: !splitPaneButtonUp,
    };
  },
};

const appModel: SearchModel = {
  namespace: 'search',
  state: {
    pinned: false,
    splitPaneSize: SPLIT_PANE_SIZE_MIN,
    splitPaneButtonUp: true,
  },
  effects,
  reducers,
  sagas: [watchSelectionTextChange],
};

export default appModel;


function* watchSelectionTextChange() {
  yield fork(function* () {
    let task;
    while (true) {
      const action = yield take('search/selectionTextChange');
      if (task) {
        yield cancel(task);
      }
      // if text has multiline, we ignore it
      if (!action?.payload?.newText?.includes('\n')) {
        task = yield fork(debounced, action);
      }
    }
  });

  function* debounced(action) {
    yield delay(800);
    yield put({
      ...action,
      type: 'search/debouncedSelectionTextChange',
    });
  }
}
