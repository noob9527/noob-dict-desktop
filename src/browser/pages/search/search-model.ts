import { call, put, take } from '@redux-saga/core/effects'
import { Model } from '../../redux/common/redux-model'
import {
  HomeUiService,
  SearchUiServiceToken,
} from '../../../common/services/home-ui-service'
import { rendererContainer } from '../../../common/container/renderer-container'
import { Runtime } from '../../../electron-shared/runtime'
import { END, eventChannel } from 'redux-saga'
import { setInterval } from 'timers'
import {
  GlobalHistoryService,
  GlobalHistoryServiceToken,
} from '../../../common/services/global-history-service'

export const SPLIT_PANE_SIZE_MAX = 450
export const SPLIT_PANE_SIZE_MIN = 60;
export const SPLIT_PANE_SIZE_MIDDLE = (400 + 60) / 2;

const globalHistoryService = rendererContainer.get<GlobalHistoryService>(GlobalHistoryServiceToken);

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
    const homeUIService = rendererContainer.get<HomeUiService>(SearchUiServiceToken);
    const pinned = yield call([homeUIService, homeUIService.togglePin]);
    yield put({
      type: 'search/mergeState',
      payload: { pinned },
    });
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
  * syncHistories() {
    yield call([globalHistoryService, globalHistoryService.syncHistories]);
    // todo
    yield put({
      type: 'root/refreshUserFromStorage',
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
  // todo:
  // sagas: [watchClockEvent],
};

export default searchModel;

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
      if (Runtime.isDev) {
        // in dev mode
        // we do not sync history immediately after app is initialized
        yield take(chan);
        yield put({
          type: 'search/syncHistories',
        });
      } else {
        yield put({
          type: 'search/syncHistories',
        });
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
