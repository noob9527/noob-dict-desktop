import { Model } from 'dva';

const model: Model = {
  namespace: 'app',
  state: {
    counter: 0
  },
  effects: {
    * increase(action, { put }) {
      yield put({ type: 'inc' });
    }
  },
  reducers: {
    inc(state) {
      return {
        ...state,
        counter: state.counter + 1
      };
    },
  }
};

export default model;
