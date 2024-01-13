import { Model } from '../redux/common/redux-model';
import { call, put, select } from '@redux-saga/core/effects';
import { rendererContainer } from '../../common/container/renderer-container';
import { HomeUiService, SearchUiServiceToken } from '../../common/services/home-ui-service';
import { ClipboardService, ClipboardServiceToken } from '../../common/services/clipboard-service';
import { WindowId } from '../../common/window-id';
import { getCurrentWindowId } from '../utils/window-utils';
import logger from '../../electron-shared/logger';
import { AppService, AppServiceToken } from '../../common/services/app-service';
import { UserProfile } from '../../electron-shared/user-profile/user-profile';
import { WindowEvent } from '../../common/window-event';
import { EcDictSearchService } from '../../electron-renderer/services/ecdict-search-service';
import { EcDictSearchServiceToken } from '../../common/services/search-service';
import { LocalDbService, LocalDbServiceToken } from '../../common/services/db/local-db-service';

const searchUiService = rendererContainer.get<HomeUiService>(SearchUiServiceToken);
const appService = rendererContainer.get<AppService>(AppServiceToken);

export interface TransientState {
  focusInput: boolean,
  isSearchWindowOpen: boolean
  windowIdentifier: WindowId
  ecDictAvailable: boolean,
  localDbAvailable: boolean,
}

interface TransientModel extends Model {
  state: TransientState
}

const transientState: TransientState = {
  focusInput: false,
  isSearchWindowOpen: !appService.getProcess().argv.includes('--background'),
  windowIdentifier: getCurrentWindowId(),
  ecDictAvailable: false,
  localDbAvailable: false,
};

interface ShowSearchWindowAction {
  type: '_transient/showSearchWindow',
  payload?: {
    focusInput: boolean
  }
}

const effects = {
  * showSearchWindow(action: ShowSearchWindowAction) {
    logger.log(action);
    yield call([searchUiService, searchUiService.show]);
    yield put({
      type: '_transient/mergeState',
      payload: {
        focusInput: action.payload?.focusInput ?? true,
      }
    });
  },
  * hideSearchWindow() {
    yield call([searchUiService, searchUiService.hide]);
  },
  * topSearchWindow() {
    yield call([searchUiService, searchUiService.show]);
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
    const state: TransientState = yield select(s => s._transient);
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
    const profile: UserProfile = yield select(state => state.setting);
    if (profile.readClipboard) {
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
  * setEcDictAvailable() {
    const ecDictSearchService = rendererContainer.get<EcDictSearchService>(EcDictSearchServiceToken);
    const available = yield call([ecDictSearchService, ecDictSearchService.fetchAvailable]);
    yield put({
      type: '_transient/mergeState',
      payload: {
        ecDictAvailable: available,
      },
    });
  },
  * setLocalDbAvailable() {
    const localDbService = rendererContainer.get<LocalDbService>(LocalDbServiceToken);
    const available = yield call([localDbService, localDbService.fetchAvailable]);
    yield put({
      type: '_transient/mergeState',
      payload: {
        localDbAvailable: available,
      },
    });
  },
};

[WindowEvent.show, WindowEvent.restore].forEach(event =>
  effects[event.getIpcChannelName(WindowId.HOME)] = function * () {
    yield put({
      type: '_transient/searchWindowOpened',
    });
  }
);

const reducers = {
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload,
    };
  },
};

[WindowEvent.hide, WindowEvent.minimize].forEach(event =>
  reducers[event.getIpcChannelName(WindowId.HOME)] = function (state, action: any) {
    return {
      ...state,
      isSearchWindowOpen: false,
    };
  }
);

const transientModel: TransientModel = {
  namespace: '_transient',
  state: transientState,
  effects,
  reducers,
};

export default transientModel;

