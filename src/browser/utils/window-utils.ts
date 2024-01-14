import { WindowId } from '../../common/window-id';

function getCurrentWindowId() {
  switch (window?.location?.hash) {
    case '#/search':
      return WindowId.HOME;
    case '#/setting':
      return WindowId.SETTING;
    case '#/login':
      return WindowId.LOGIN;
    case '#/developer':
      return WindowId.DEVELOPER;
    default:
      return WindowId.HOME;
  }
}

export {
  getCurrentWindowId,
};

