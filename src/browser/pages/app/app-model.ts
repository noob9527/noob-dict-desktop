import { put } from "@redux-saga/core/effects";
import { Model } from "../../redux/redux-model";

const effects = {
  * increase(action) {
    yield put({ type: 'app/inc' });
  },
  * decrease(action) {
    yield put({ type: 'app/dec' });
  }
};

const reducers = {
  inc(state) {
    console.log('inc', state);
    return {
      ...state,
      counter: state.counter + 1
    };
  },
  dec(state) {
    console.log('dec', state);
    return {
      ...state,
      counter: state.counter - 1
    };
  },
};

const appModel: Model = {
  namespace: 'app',
  state: {
    counter: 5
  },
  effects,
  reducers,
};

export default appModel;
