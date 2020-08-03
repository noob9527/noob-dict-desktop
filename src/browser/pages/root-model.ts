import { Model } from '../redux/common/redux-model';
import { dark } from '../theme/dark';
import { call, put, take } from '@redux-saga/core/effects';
import { END, eventChannel } from 'redux-saga';
import { rendererContainer } from '../../common/container/renderer-container';
import { AppService, AppServiceToken } from '../../common/services/app-service';
import { UserService, UserServiceToken } from '../../common/services/user-service';
import { LoginChannel } from '../../common/ipc-channel';
import logger from '../../common/utils/logger';
import { User } from '../../common/model/user';
import { LoginUiService, LoginUiServiceToken } from '../../common/services/login-ui-service';
import { setInterval } from 'timers';
import { GlobalHistoryService, GlobalHistoryServiceToken } from '../../common/services/global-history-service';
import electronIsDev from 'electron-is-dev';

const appService = rendererContainer.get<AppService>(AppServiceToken);
const userService = rendererContainer.get<UserService>(UserServiceToken);
const loginUiService = rendererContainer.get<LoginUiService>(LoginUiServiceToken);
const globalHistoryService = rendererContainer.get<GlobalHistoryService>(GlobalHistoryServiceToken);

export interface RootState {
  theme: any
  app: {
    version: String
  }
  showLoginIndicator: boolean
  currentUser: User | null | undefined
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
    } else {
      yield put({
        type: 'root/loginFailed',
      });
    }
  },
  * logout() {
    yield put({
      type: 'root/mergeState',
      payload: { currentUser: null },
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
    currentUser: userService.fetchCurrentUserFromStorage(),
  },
  effects,
  reducers,
  sagas: [watchClockEvent],
};

export default rootModel;

// call sync for each hour
const DURATION = 1000 * 60 * 60;

/**
 * call sync histories for each DURATION
 * it's just an example shows how to setInterval in redux-saga way
 * we do not actually need it, in fact, we just need to syncHistories one time after app initialized
 * see:
 * https://github.com/redux-saga/redux-saga/blob/master/docs/advanced/Channels.md#using-the-eventchannel-factory-to-connect-to-external-events
 */
export function* watchClockEvent() {
  const chan = yield call(interval, Number.MAX_SAFE_INTEGER);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      if (electronIsDev) {
        // in dev mode
        // we do not sync history after app initilized
        yield take(chan);
        yield call([globalHistoryService, globalHistoryService.syncHistories]);
      } else {
        yield call([globalHistoryService, globalHistoryService.syncHistories]);
        yield take(chan);
      }
      // let times = yield take(chan);
      // console.log(`times: ${times}`);
    }
  } finally {
    // 'clock terminated'
  }
}

function interval(maxTime: number) {
  let times = 0;
  return eventChannel(emitter => {
      const iv = setInterval(() => {
        times++;
        if (times >= maxTime) {
          // this causes the channel to close
          emitter(END);
        } else {
          emitter(times);
        }
      }, DURATION);
      // The subscriber must return an unsubscribe function
      return () => {
        clearInterval(iv);
      };
    },
  );
}
