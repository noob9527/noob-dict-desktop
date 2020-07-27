import { Model } from '../redux/common/redux-model';
import { call, put, select } from '@redux-saga/core/effects';
import { rendererContainer } from '../../common/container/renderer-container';
import { SettingUiService, SettingUiServiceToken } from '../../common/services/setting-ui-service';
import { SearchUiService, SearchUiServiceToken } from '../../common/services/search-ui-service';
import { SearchChannel, SettingChannel } from '../../common/ipc-channel';
import { SettingState } from './setting/setting-model';
import { ClipboardService, ClipboardServiceToken } from '../../common/services/clipboard-service';
import { WindowId } from '../../common/window-constants';
import { getWindowId } from '../utils/window-utils';
import logger from '../../common/utils/logger';
import { AppService, AppServiceToken } from '../../common/services/app-service';

const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
const appService = rendererContainer.get<AppService>(AppServiceToken);

export interface TransientState {
  focusInput: boolean,
  isSettingWindowOpen: boolean
  isSearchWindowOpen: boolean
  windowIdentifier: WindowId
}

interface TransientModel extends Model {
  state: TransientState
}

const transientState: TransientState = {
  focusInput: false,
  isSearchWindowOpen: !appService.getProcess().argv.includes('--background'),
  isSettingWindowOpen: false,
  windowIdentifier: getWindowId(),
};

interface ShowSearchWindowAction {
  type: '_transient/showSearchWindow',
  payload?: {
    focusInput: boolean
  }
}

const effects = {
  * showSearchWindow(action: ShowSearchWindowAction) {
    const state: TransientState = yield select(state => state._transient);
    logger.log(action);
    yield call([searchUiService, searchUiService.showSearchWindow], {
      isSettingWindowOpen: state.isSearchWindowOpen
    });
    yield put({
      type: '_transient/mergeState',
      payload: {
        focusInput: action.payload?.focusInput ?? true,
      }
    });
  },
  * hideSearchWindow() {
    const state: TransientState = yield select(state => state._transient);
    yield call([searchUiService, searchUiService.hideSearchWindow], {
      isSettingWindowOpen: state.isSearchWindowOpen
    });
  },
  * topSearchWindow() {
    const state: TransientState = yield select(state => state._transient);
    yield call([searchUiService, searchUiService.showSearchWindow], {
      isSettingWindowOpen: state.isSearchWindowOpen
    });
    // yield put({
    //   type: '_transient/mergeState',
    //   payload: {
    //     focusInput: false,
    //   }
    // });
    yield put({
      type: '_transient/mergeState',
      payload: {
        focusInput: true,
      }
    });
  },
  * appHotKeyPressed() {
    const state: TransientState = yield select(state => state._transient);
    if (state.isSearchWindowOpen) {
      if (state.focusInput) {
        // if search input is focused, we hide the window
        yield put({
          type: '_transient/hideSearchWindow'
        });
      } else {
        // else, we focus on input
        yield put({
          type: '_transient/topSearchWindow'
        });
      }
    } else {
      yield put({
        type: '_transient/showSearchWindow'
      });
    }
  },
  * searchWindowOpened() {
    const settingState: SettingState = yield select(state => state.setting);
    if (settingState.readClipboard) {
      const clipboardText = rendererContainer.get<ClipboardService>(ClipboardServiceToken).readClipboardText();
      if (clipboardText && clipboardText.length < 20) {
        yield put({
          type: 'searchInput/searchTextChange',
          text: clipboardText,
        });
      }
    }
    yield put({
      type: '_transient/mergeState',
      payload: {
        isSearchWindowOpen: true,
      },
    });
  },
  * settingWindowOpened() {
    yield put({
      type: '_transient/mergeState',
      payload: { isSettingWindowOpen: true },
    });
  },
  * [SearchChannel.SEARCH_WINDOW_SHOWED]() {
    yield put({
      type: '_transient/searchWindowOpened',
    });
  },
  * [SearchChannel.SEARCH_WINDOW_HIDED]() {
    yield put({
      type: '_transient/searchWindowClosed',
    });
  },
  * [SearchChannel.SEARCH_WINDOW_RESTORED]() {
    yield put({
      type: '_transient/searchWindowOpened',
    });
  },
  * [SearchChannel.SEARCH_WINDOW_MINIMIZED]() {
    yield put({
      type: '_transient/searchWindowClosed',
    });
  },
  * [SearchChannel.SEARCH_WINDOW_FOCUS]() {
  },
  * [SearchChannel.SEARCH_WINDOW_BLUR]() {
  },
};

const reducers = {
  searchWindowClosed(state, action: any) {
    return {
      ...state,
      isSearchWindowOpen: false,
    };
  },
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload,
    };
  },
  [SettingChannel.SETTING_WINDOW_OPENED](state, action: any) {
    return {
      ...state,
      isSearchWindowOpen: true
    };
  },
  [SettingChannel.SETTING_WINDOW_CLOSED](state, action: any) {
    return {
      ...state,
      isSearchWindowOpen: false
    };
  }
};

const transientModel: TransientModel = {
  namespace: '_transient',
  state: transientState,
  effects,
  reducers,
};

export default transientModel;

