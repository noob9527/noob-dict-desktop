/**
 * reference:
 * - https://www.electronjs.org/docs/api/menu
 * - https://github.com/electron/electron/blob/master/lib/browser/default-menu.ts
 * - https://github.com/rhysd/electron-about-window
 */
import { Menu } from 'electron';
import { mainContainer } from '../common/container/main-container';
import { getIconPath, getBuildPath } from '../electron-shared/path-util';
import { APP_CONSTANTS } from '../common/app-constants';
// import gitInfo from './utils/git-info';
import openAboutWindow from 'about-window';
import { getOrCreateSearchWindow } from './window/search-window';
import { getOrCreateSettingWindow } from './window/setting-window';
import { getOrCreateLoginWindow } from './window/login-window';
import { getOrCreateDeveloperWindow } from './window/debug-window';
import { Runtime } from '../electron-shared/runtime';

export {
  getOrCreateAppMenu,
}

const AppMenuToken = Symbol.for('app-menu');
mainContainer.bind<Menu>(AppMenuToken).toDynamicValue(createMenu);

function getOrCreateAppMenu() {
  return mainContainer.get<Menu>(AppMenuToken);
}

function createMenu(): Menu {
  const toolMenu: Electron.MenuItemConstructorOptions = {
    label: 'Tool',
    submenu: [
      {
        label: 'Developer Utilities',
        click: () => getOrCreateDeveloperWindow(),
      },
    ]
  };

  const use_version_info = [
    ...['electron', 'chrome', 'node', 'v8']
            .map(e => [e, process.versions[e]]).filter(Boolean), // remove null value
    // todo: vite build git info
    // ['git', gitInfo.version],
  ] as [string, string][];

  // todo: about-window currently doesn't work in vite build system
  // currently, I don't know how to make about-window work with vite build system.
  // 1. if I make it an external package(rollupOptions: { external: ['about-window'] })
  //   then build about-window project with tsc -m commonjs/es6. both of them doesn't work.
  // 2. if I use vite load the package, then I got to find a way to solve
  // the path of 'about.html','package.json' correctly.
  // const helpMenu: Electron.MenuItemConstructorOptions = {
  //   role: 'help',
  //   submenu: [
  //     {
  //       label: 'About',
  //       click: () => {
  //         openAboutWindow({
  //           icon_path: getIconPath('icon@32x.png'),
  //           product_name: APP_CONSTANTS.PRODUCT_NAME,
  //           copyright: APP_CONSTANTS.COPYRIGHT,
  //           homepage: APP_CONSTANTS.HOME_PAGE,
  //           package_json_dir: getBuildPath(),
  //           // about_page_dir: getBuildPath(),
  //           use_version_info,
  //           win_options: {
  //             parent: getOrCreateSearchWindow(),
  //             modal: !Runtime.isMac,
  //             maximizable: false,
  //             minimizable: false,
  //           }
  //           // open_devtools: true,
  //         });
  //       },
  //     }
  //   ]
  // };
  const macAppMenu: Electron.MenuItemConstructorOptions = { role: 'appMenu' };
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(Runtime.isMac ? [macAppMenu] : []),
    {
      role: 'fileMenu',
      submenu: [
        // {
        //   label: 'Login',
        //   click: () => getOrCreateLoginWindow(),
        // },
        {
          label: 'Setting',
          click: () => getOrCreateSettingWindow(),
        },
        {
          role: 'quit',
        },
      ]
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    toolMenu,
    // helpMenu,
  ];
  return Menu.buildFromTemplate(template);
}
