// @remove-file-on-eject
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict'

const babelJest = require('babel-jest')
const importMetaBabelPlugin = require('./importMetaBabelPlugin')

module.exports = babelJest.createTransformer({
  presets: [
    // require.resolve('babel-preset-react-app'),
    'react-app',
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
      },
    ],
  ],
  plugins: [
      // solve import.meta.env in jest.
      // see ./importMetaBabelPlugin
      [importMetaBabelPlugin]
  ],
  babelrc: false,
  configFile: false,
})
