import { Model } from "../redux/redux-model";
import { dark } from "../theme/dark";

const reducers = {
  mergeState(state, action: any) {
    return {
      ...state,
      ...action.payload
    };
  },
};

const rootModel: Model = {
  namespace: 'root',
  state: {
    theme: dark
  },
  reducers,
};

export default rootModel;
