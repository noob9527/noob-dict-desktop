import { Model } from '../redux/common/redux-model';
import { dark } from '../theme/dark';
import { call, put } from '@redux-saga/core/effects';
import { rendererContainer } from '../../common/container/renderer-container';
import { AppService, AppServiceToken } from '../../common/services/app-service';
import { UserService, UserServiceToken } from '../../common/services/user-service';
import { LoginChannel } from '../../common/ipc-channel';
import logger from '../../common/utils/logger';
import { storage } from '../utils/storage';
import { User } from '../../common/model/user';
import { LoginUiService, LoginUiServiceToken } from '../../common/services/login-ui-service';

const appService = rendererContainer.get<AppService>(AppServiceToken);
const userService = rendererContainer.get<UserService>(UserServiceToken);
const loginUiService = rendererContainer.get<LoginUiService>(LoginUiServiceToken);

export interface RootState {
  theme: any
  app: {
    version: String
  }
  currentUser: User | null
}

export interface RootModel extends Model {
  state: RootState
}

const effects = {
  * login() {
    console.log('login');
    yield call([loginUiService, loginUiService.open]);
  },
  * [LoginChannel.LOGIN_CODE_RECEIVED](action) {
    const { payload } = action;
    let user = null;
    try {
      user = yield call([userService, userService.login], payload.code, payload.loginOption);
    } catch (e) {
      logger.error('fail to fetch user info');
    }
    if (!user) return;
    yield call([storage, storage.putObject], 'currentUser', user);
    yield put({
      type: 'root/loginSuccess',
      payload: { user }
    });
  },
  * logout() {
    yield put({
      type: 'root/mergeState',
      payload: { currentUser: null }
    });
    yield call([storage, storage.remove], 'currentUser');
  },
};

const reducers = {
  loginSuccess(state, action: any) {
    return {
      ...state,
      currentUser: action.payload.user
    }
  },
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload
    };
  },
};

const rootModel: RootModel = {
  namespace: 'root',
  state: {
    theme: dark,
    app: {
      version: appService.getVersion()
    },
    currentUser: storage.getObject('currentUser'),
  },
  effects,
  reducers,
};

export default rootModel;
