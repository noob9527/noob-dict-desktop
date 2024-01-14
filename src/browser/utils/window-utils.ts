import { WindowId } from '../../common/window-id';

function getCurrentWindowId() {
  const hash = window?.location?.hash
  switch (hash) {
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
      if (hash?.includes('/search')) {
        return WindowId.HOME;
      } else {
        throw new Error(`unknown window, hash = ${hash}`)
      }
  }
}

export {
  getCurrentWindowId,
};

