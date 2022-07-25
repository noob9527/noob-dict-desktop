enum SettingChannel {
  OPEN_SETTING_WINDOW = 'OPEN_SETTING_WINDOW',
  SETTING_CHANGE = 'SETTING_CHANGE',
  GET_SETTING = 'GET_SETTING',
}

enum SearchChannel {
  TOGGLE_PIN_SEARCH_WINDOW = 'TOGGLE_PIN_SEARCH_WINDOW',
  TOGGLE_SEARCH_WINDOW = 'TOGGLE_SEARCH_WINDOW',
  SHOW_SEARCH_WINDOW = 'SHOW_SEARCH_WINDOW',
  HIDE_SEARCH_WINDOW = 'HIDE_SEARCH_WINDOW',
  TOP_SEARCH_WINDOW = 'TOP_SEARCH_WINDOW',
  SEARCH = 'SEARCH',
}

enum PopupChannel {
  SHOW_POPUP_WINDOW = 'SHOW_POPUP_WINDOW',
  HIDE_POPUP_WINDOW = 'HIDE_POPUP_WINDOW',
}

enum GlobalShotCutChannel {
  APP_HOT_KEY_PRESSED = 'APP_HOT_KEY_PRESSED'
}

enum LoginChannel {
  SHOW_LOGIN_WINDOW = 'SHOW_LOGIN_WINDOW',
  LOGIN_CODE_RECEIVED = 'LOGIN_CODE_RECEIVED',
}

enum AutoUpdaterChannel {
  CHECKING_FOR_UPDATE = 'checking-for-update',
  UPDATE_AVAILABLE = 'update-available',
  UPDATE_NOT_AVAILABLE = 'update-not-available',
  ERROR = 'error',
  DOWNLOAD_PROGRESS = 'download-progress',
  UPDATE_DOWNLOADED = 'update-downloaded',
}

enum AppChannel {
  APP_QUITING = 'APP_QUITING'
}

// enum TrayChannel {
//   PUT_IN_TRAY = 'PUT_IN_TRAY',
//   REMOVE_TRAY = 'REMOVE_TRAY'
// }

export {
  SettingChannel,
  SearchChannel,
  PopupChannel,
  GlobalShotCutChannel,
  AutoUpdaterChannel,
  LoginChannel,
  AppChannel,
};

