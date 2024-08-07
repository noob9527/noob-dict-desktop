/**
 * this file is original generated by create-react-app eject.
 */
const path = require('path');

// refer to
// - https://github.com/facebook-atom/jest-electron-runner
// - https://github.com/facebook/create-react-app
const common = {
  rootDir: path.join(__dirname, '../../'),
  "roots": [
    "<rootDir>/src"
  ],
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts"
  ],
  "setupFiles": [
    "react-app-polyfill/jsdom"
  ],
  "setupFilesAfterEnv": [],
  "testMatch": [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
  ],
  "testEnvironment": "jest-environment-jsdom-fourteen",
  "transform": {
    // "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/config/jest/babelTransform.js",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
  },
  "transformIgnorePatterns": [
    // somehow I need to comment this line out
    // to make gemini-llm-service-impl.test.ts work
    // "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$"
  ],
  "modulePaths": [],
  "moduleNameMapper": {
    "^react-native$": "react-native-web",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
  },
  "moduleFileExtensions": [
    "web.js",
    "js",
    "web.ts",
    "ts",
    "web.tsx",
    "tsx",
    "json",
    "web.jsx",
    "jsx",
    "node"
  ],
  "watchPlugins": [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
};

module.exports = {
  projects: [
    {
      ...common,
      runner: '@jest-runner/electron/main',
      testEnvironment: 'node',
      testMatch: [
        // electron-main
        '<rootDir>/src/electron-main/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/electron-main/**/*.{spec,test}.{js,jsx,ts,tsx}',
        // common
        '<rootDir>/src/common/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/common/**/*.{spec,test}.{js,jsx,ts,tsx}',
        // electron-shared
        '<rootDir>/src/electron-shared/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/electron-shared/**/*.{spec,test}.{js,jsx,ts,tsx}',
        // node
        '<rootDir>/src/node/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/node/**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
    },
    {
      ...common,
      runner: '@jest-runner/electron',
      testEnvironment: '@jest-runner/electron/environment',
      testMatch: [
        // electron-renderer
        '<rootDir>/src/electron-renderer/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/electron-renderer/**/*.{spec,test}.{js,jsx,ts,tsx}',
        // browser
        '<rootDir>/src/browser/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/browser/**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
    }
  ]
};
