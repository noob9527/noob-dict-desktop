import { WindowIdentifier } from '../../common/window-constants';

function getWindowIdentifier() {
  switch (window?.location?.hash) {
    case '#/search':
      return WindowIdentifier.SEARCH;
    case '#/setting':
      return WindowIdentifier.SETTING;
    case '#/popup':
      return WindowIdentifier.POPUP;
    default:
      return WindowIdentifier.SEARCH;
  }
}

export {
  getWindowIdentifier,
};

