import { WindowId } from '../../common/window-constants';

function getWindowId() {
  switch (window?.location?.hash) {
    case '#/search':
      return WindowId.SEARCH;
    case '#/setting':
      return WindowId.SETTING;
    case '#/popup':
      return WindowId.POPUP;
    default:
      return WindowId.SEARCH;
  }
}

export {
  getWindowId,
};

