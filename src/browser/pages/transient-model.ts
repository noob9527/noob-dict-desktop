import { Model } from '../redux/common/redux-model';
import { call, put, select } from '@redux-saga/core/effects';
import { rendererContainer } from '../../common/container/renderer-container';
import { SettingUiService, SettingUiServiceToken } from '../../common/services/setting-ui-service';
import { SearchUiService, SearchUiServiceToken } from '../../common/services/search-ui-service';
import { SearchChannel } from '../../common/ipc-channel';
import { SettingState } from './setting/setting-model';
import { ClipboardService, ClipboardServiceToken } from '../../common/services/clipboard-service';

export interface TransientState {
  isSettingWindowOpen: boolean
  isSearchWindowOpen: boolean
}

interface TransientModel extends Model {
  state: TransientState
}

const state = {
  isSearchWindowOpen: true,
  isSettingWindowOpen: false,
};

const effects = {
  * showSearchWindow() {
    const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
    yield call([searchUiService, searchUiService.showSearchWindow]);
  },
  * toggleSearchWindow() {
    const state: TransientState = yield select(state => state._transient);
    const searchUiService = rendererContainer.get<SearchUiService>(SearchUiServiceToken);
    yield call(
      [searchUiService, searchUiService.toggleSearchWindow],
      { isSettingWindowOpen: state.isSettingWindowOpen },
    );
  },
  * openSettingWindow() {
    const settingUiService = rendererContainer.get<SettingUiService>(SettingUiServiceToken);
    const isSettingWindowOpen = yield call([settingUiService, settingUiService.open]);
    yield put({
      type: '_transient/mergeState',
      payload: { isSettingWindowOpen },
    });
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
};

const transientModel: TransientModel = {
  namespace: '_transient',
  state,
  effects,
  reducers,
};

export default transientModel;

