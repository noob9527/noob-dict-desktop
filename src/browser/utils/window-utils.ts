import { WindowId } from '../../common/window-id';

function getCurrentWindowId() {
  switch (window?.location?.hash) {
    case '#/main/search':
      return WindowId.HOME;
    case '#/setting':
      return WindowId.SETTING;
    case '#/login':
      return WindowId.LOGIN;
    case '#/developer':
      return WindowId.DEVELOPER;
    case '#/sync':
      return WindowId.SYNC;
    default:
      throw new Error(`unknown window, hash = ${window?.location?.hash}`)
  }
}

export {
  getCurrentWindowId,
};

