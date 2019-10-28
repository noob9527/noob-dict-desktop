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
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
  },
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
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
        // main
        '<rootDir>/src/main/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/main/**/*.{spec,test}.{js,jsx,ts,tsx}',
        // shared
        '<rootDir>/src/shared/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/shared/**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
    },
    {
      ...common,
      runner: '@jest-runner/electron',
      testEnvironment: '@jest-runner/electron/environment',
      testMatch: [
        // renderer
        '<rootDir>/src/renderer/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/renderer/**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
    }
  ]
};
