import { WindowId } from '../../common/window-id';

function getCurrentWindowId() {
  switch (window?.location?.hash) {
    case '#/search':
      return WindowId.SEARCH;
    case '#/setting':
      return WindowId.SETTING;
    case '#/popup':
      return WindowId.POPUP;
    case '#/login':
      return WindowId.LOGIN;
    case '#/developer':
      return WindowId.DEVELOPER;
    default:
      return WindowId.SEARCH;
  }
}

export {
  getCurrentWindowId,
};

