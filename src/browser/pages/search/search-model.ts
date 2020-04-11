import { call, cancel, delay, fork, put, select, take } from '@redux-saga/core/effects';
import { Model } from '../../redux/common/redux-model';
import { SearchUiService, SearchUiServiceToken } from '../../../common/services/search-ui-service';
import { rendererContainer } from '../../../common/container/renderer-container';
import { SettingState } from '../setting/setting-model';
import { TransientState } from '../transient-model';
import { PopupUiService, PopupUiServiceToken } from '../../../common/services/popup-ui-service';

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

interface SearchAction {
  type: 'search/search',
  payload: {
    text: string
    engine?: string
  }
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

    // // selection search only when window is not pinned
    // if (!searchState.pinned) {
    //   const popupUiService = rendererContainer.get<PopupUiService>(PopupUiServiceToken);
    //   popupUiService.show();
    // }

    if (transientState.isSearchWindowOpen) {
      if (searchState.pinned) {
        yield put({
          type: 'search/search',
          payload: {
            text: action.payload.newText,
          },
        });
      }
    }
  },
  * clipboardTextChange(action) {
    // console.log(action);
  },
  * search(action: SearchAction) {
    yield put({
      type: 'searchInput/searchTextChange',
      text: action.payload.text,
    });
    yield put({
      type: 'searchPanel/fetchResults',
      text: action.payload.text,
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

const searchModel: SearchModel = {
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

export default searchModel;


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
