enum SettingChannel {
  OPEN_SETTING_WINDOW = 'OPEN_SETTING_WINDOW',
  SETTING_WINDOW_CLOSED = 'SETTING_WINDOW_CLOSED',
  SETTING_CHANGE = 'SETTING_CHANGE',
  GET_SETTING = 'GET_SETTING',
}

enum SearchChannel {
  TOGGLE_PIN_SEARCH_WINDOW = 'TOGGLE_PIN_SEARCH_WINDOW',
  TOGGLE_SEARCH_WINDOW = 'TOGGLE_SEARCH_WINDOW',
  SHOW_SEARCH_WINDOW = 'SHOW_SEARCH_WINDOW',

  SEARCH_WINDOW_SHOWED = 'SEARCH_WINDOW_SHOWED',
  SEARCH_WINDOW_HIDED = 'SEARCH_WINDOW_HIDED',

  SEARCH_WINDOW_MINIMIZED = 'SEARCH_WINDOW_MINIMIZED',
  SEARCH_WINDOW_RESTORED = 'SEARCH_WINDOW_RESTORED',

  SEARCH_WINDOW_FOCUS = 'SEARCH_WINDOW_FOCUS',
  SEARCH_WINDOW_BLUR = 'SEARCH_WINDOW_BLUR',
}

enum PopupChannel {
  SHOW_POPUP_WINDOW = 'SHOW_POPUP_WINDOW'
}

enum GlobalShotCutChannel {
  APP_HOT_KEY_PRESSED = 'APP_HOT_KEY_PRESSED'
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
};

