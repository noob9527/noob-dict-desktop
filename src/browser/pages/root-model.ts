import { Model } from '../redux/common/redux-model';
import { dark } from '../theme/dark';
import { call, put } from '@redux-saga/core/effects';
import { rendererContainer } from '../../common/container/renderer-container';
import { AppService, AppServiceToken } from '../../common/services/app-service';
import { UserService, UserServiceToken } from '../../common/services/user-service';
import logger from '../../electron-shared/logger';
import { User } from '../../common/model/user';
import { LoginUiService, LoginUiServiceToken } from '../../common/services/login-ui-service';
import { LoginChannel } from '../../electron-shared/ipc/ipc-channel-login';

const appService = rendererContainer.get<AppService>(AppServiceToken);
const userService = rendererContainer.get<UserService>(UserServiceToken);
const loginUiService = rendererContainer.get<LoginUiService>(LoginUiServiceToken);

export interface RootState {
  theme: any
  app: {
    version: String
  }
  showLoginIndicator: boolean
  currentUser: User | null | undefined
  lastEvaluatedUpdateAt: Date | null,
}

export interface RootModel extends Model {
  state: RootState
}

const effects = {
  * init() {
    yield put({
      type: 'root/refreshUserFromStorage',
    });
    // yield put({
    //   type: 'setting/init',
    // });
  },
  * refreshUserFromStorage() {
    yield put({
      type: 'root/setCurrentUser',
    });
    yield put({
      type: 'root/setLastEvaluatedUpdateAt',
    });
  },
  // sync state.currentUser from storage
  * setCurrentUser() {
    try {
      const currentUser = yield call([userService, userService.fetchCurrentUserFromStorage]);
      yield put({
        type: 'root/mergeState',
        payload: {
          currentUser,
        },
      });
    } catch (e) {
      logger.error('fail to fetch currentUser');
    }
  },
  // sync state.lastEvaluatedUpdateAt from storage
  * setLastEvaluatedUpdateAt() {
    try {
      const lastEvaluatedUpdateAt = yield call([userService, userService.getLastEvaluatedUpdateAt]);
      yield put({
        type: 'root/mergeState',
        payload: {
          lastEvaluatedUpdateAt,
        },
      });
    } catch (e) {
      logger.error('fail to fetch lastEvaluatedUpdateAt');
    }
  },
  * login() {
    console.log('login');
    yield call([loginUiService, loginUiService.show]);
  },
  * [LoginChannel.LOGIN_CODE_RECEIVED](action) {
    const { payload } = action;
    let user = null;
    yield put({
      type: 'root/mergeState',
      payload: { showLoginIndicator: true },
    });
    try {
      user = yield call([userService, userService.login], payload.code, payload.loginOption);
    } catch (e) {
      logger.error('fail to fetch user info');
    }
    if (user) {
      yield put({
        type: 'root/loginSuccess',
        payload: { user },
      });
      yield put({
        type: 'root/setLastEvaluatedUpdateAt',
      });
    } else {
      yield put({
        type: 'root/loginFailed',
      });
    }
  },
  * logout() {
    yield put({
      type: 'root/mergeState',
      payload: {
        currentUser: null,
        lastEvaluatedUpdateAt: null,
      },
    });
    yield call([userService, userService.logout]);
  },
};

const reducers = {
  loginSuccess(state, action: any) {
    return {
      ...state,
      currentUser: action.payload.user,
      showLoginIndicator: false,
    };
  },
  loginFailed(state) {
    return {
      ...state,
      showLoginIndicator: false,
    };
  },
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload,
    };
  },
};

const rootModel: RootModel = {
  namespace: 'root',
  state: {
    theme: dark,
    app: {
      version: appService.getVersion(),
    },
    showLoginIndicator: false,
    currentUser: null,
    lastEvaluatedUpdateAt: null,
  },
  effects,
  reducers,
};

export default rootModel;

