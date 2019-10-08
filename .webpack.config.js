const { default: darkTheme } = require('@ant-design/dark-theme');
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  // change target to electron
  // https://www.codementor.io/randyfindley/how-to-build-an-electron-app-using-create-react-app-and-electron-builder-ss1k0sfer
  // https://webpack.js.org/configuration/target/
  config => {
    config.target = 'electron-renderer';
    return config;
  },
  // only import needed components
  // see https://ant.design/docs/react/use-in-typescript-cn
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  // change theme
  // https://ant.design/docs/react/customize-theme-cn
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { '@primary-color': '#1DA57A' },
    modifyVars: darkTheme,
  }),
);

