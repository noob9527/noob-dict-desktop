import axios from 'axios';
import { APP_CONSTANTS } from '../../common/app-constants';

axios.defaults.baseURL = APP_CONSTANTS.API_PREFIX;

let currentUser;

export function registerUserChangeListener(store) {
  store.subscribe(() => {
    const previousValue = currentUser;
    currentUser = select(store.getState());
    if (previousValue !== currentUser) {
      axios.defaults.headers.common.tokenHeader = currentUser.id_token;
    }
  });
}

function select(state) {
  return state.root.currentUser;
}
