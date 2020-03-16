import { Model } from '../redux/common/redux-model';
import { dark } from '../theme/dark';
import { rendererContainer } from '../../common/container/renderer-container';
import { AppService, AppServiceToken } from '../../common/services/app-service';

const appService = rendererContainer.get<AppService>(AppServiceToken);

export interface RootState {
  theme: any
  app: {
    version: String
  }
}

export interface RootModel extends Model {
  state: RootState
}

const reducers = {
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
  },
  reducers,
};

export default rootModel;
