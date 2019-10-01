process.env.HMR_PORT=0;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dHvU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electronTimber = _interopRequireDefault(require("electron-timber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _electronTimber.default;
exports.default = _default;
},{}],"aaZu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var InstanceHolder =
/** @class */
function () {
  function InstanceHolder() {
    this.map = new Map();
  }

  InstanceHolder.prototype.setIfAbsent = function (key, producer) {
    if (!this.map.has(key)) {
      this.map.set(key, producer());
    }
  };

  InstanceHolder.prototype.get = function (key) {
    return this.map.get(key);
  };

  InstanceHolder.prototype.has = function (key) {
    return this.map.has(key);
  };

  InstanceHolder.prototype.remove = function (key) {
    return this.map.delete(key);
  };

  Object.defineProperty(InstanceHolder.prototype, "size", {
    get: function get() {
      return this.map.size;
    },
    enumerable: true,
    configurable: true
  });
  return InstanceHolder;
}();

var defaultHolder = new InstanceHolder();
var _default = defaultHolder;
exports.default = _default;
},{}],"8dS/":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureTray;

var _electron = require("electron");

var path = _interopRequireWildcard(require("path"));

var _logger = _interopRequireDefault(require("../../src/shared/utils/logger"));

var _instanceHolder = _interopRequireDefault(require("../../src/shared/utils/instance-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ensureTray() {
  _instanceHolder.default.setIfAbsent(_electron.Tray, createTray);

  return _instanceHolder.default.get(_electron.Tray);
}

function createTray() {
  // todo show icon bug
  // (electron:31101): libappindicator-WARNING **: 18:59:31.347: Using '/tmp' paths in SNAP environment will lead to unreadable resources
  var iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  var iconPath = path.join(__dirname, iconName);
  var tray = new _electron.Tray(iconPath);
  var menu = createMenu();
  tray.setToolTip('Electron Demo in the tray.');
  tray.setContextMenu(menu);
  tray.on('click', function () {
    // this event doesn't work on my machine(ubuntu)
    _logger.default.log('click');
  });
  return tray;
}

function createMenu() {
  return _electron.Menu.buildFromTemplate([{
    label: 'Show',
    click: function click() {
      _logger.default.log('show');

      var window = _instanceHolder.default.get(_electron.BrowserWindow);

      if (window) {
        if (window.isMinimized()) {
          window.restore();
        }

        window.show();
      } else {
        _logger.default.error("somehow window doesn't exist");
      }
    }
  }, {
    label: 'Quit',
    click: function click() {
      _electron.app.quit();

      _logger.default.log('app.quit()');
    }
  }]);
}
},{"../../src/shared/utils/logger":"dHvU","../../src/shared/utils/instance-holder":"aaZu"}],"ZCfc":[function(require,module,exports) {
"use strict";

var _electron = require("electron");

var _logger = _interopRequireDefault(require("../src/shared/utils/logger"));

var _instanceHolder = _interopRequireDefault(require("../src/shared/utils/instance-holder"));

var _electronIsDev = _interopRequireDefault(require("electron-is-dev"));

var _tray = _interopRequireDefault(require("./tray/tray"));

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Modules to control application life and create native browser window
var is_quiting = false; // refer to:
// https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/
// https://medium.com/@johndyer24/building-a-production-electron-create-react-app-application-with-shared-code-using-electron-builder-c1f70f0e2649
// https://www.codementor.io/randyfindley/how-to-build-an-electron-app-using-create-react-app-and-electron-builder-ss1k0sfer
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

_electron.app.on("ready", ensureWindow); // Quit when all windows are closed.


_electron.app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
  //   app.quit();
  // }
  // we do not quit the app here
  _logger.default.log('window-all-closed');
}); // On OS X it"s common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.


_electron.app.on("activate", ensureWindow);

_electron.app.on("before-quit", function () {
  is_quiting = true;
});

function ensureWindow() {
  _instanceHolder.default.setIfAbsent(_electron.BrowserWindow, createWindow);

  return _instanceHolder.default.get(_electron.BrowserWindow);
}

function createWindow() {
  var window = new _electron.BrowserWindow({
    width: 1600,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
      nodeIntegration: true
    }
  });
  window.loadURL(_electronIsDev.default ? 'http://localhost:3000' : "file://" + path.join(__dirname, '../build/index.html')); // window.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  // and load the index.html of the app.
  // window.loadFile('index.html')

  window.on("close", function (e) {
    // close to tray
    // https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
    if (!is_quiting) {
      e.preventDefault();
      window.hide();
    }
  }); // Emitted when the window is closed.

  window.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    _instanceHolder.default.remove(_electron.BrowserWindow);

    _logger.default.log('closed');
  });
  window.webContents.on("did-finish-load", function () {
    (0, _tray.default)();

    _logger.default.log('did-finish-load');
  });

  if (_electronIsDev.default) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    window.webContents.openDevTools();
  }

  return window;
} // In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// hot reload


try {
  require('electron-reloader')(module);
} catch (_) {}
},{"../src/shared/utils/logger":"dHvU","../src/shared/utils/instance-holder":"aaZu","./tray/tray":"8dS/"}]},{},["ZCfc"], null)