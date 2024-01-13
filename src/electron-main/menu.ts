/**
 * reference:
 * - https://www.electronjs.org/docs/api/menu
 * - https://github.com/electron/electron/blob/master/lib/browser/default-menu.ts
 * - https://github.com/rhysd/electron-about-window
 */
import { Menu } from 'electron';
import { mainContainer } from '../common/container/main-container';
import { getIconPath, getBuildPath, getPublicPath } from '../electron-shared/path-util';
import { APP_CONSTANTS } from '../common/app-constants';
import gitInfo from './utils/git-info';
import packageJson from '../../package.json';
import openAboutWindow, { PackageJson } from 'about-window';
import { debugWindowManager } from './window/debug-window';
import { Runtime } from '../electron-shared/runtime';
import logger from '../electron-shared/logger';
import { homeWindowManager } from './window/home-window';
import { settingWindowManager } from './window/setting-window';

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
        click: () => debugWindowManager.getOrCreate(),
      },
    ]
  };

  const use_version_info = [
    ...['electron', 'chrome', 'node', 'v8']
            .map(e => [e, process.versions[e]]).filter(Boolean), // remove null value
    ['git', gitInfo.version],
  ] as [string, string][];

  const helpMenu: Electron.MenuItemConstructorOptions = {
    role: 'help',
    submenu: [
      {
        label: 'About',
        click: () => {
          openAboutWindow({
            icon_path: getIconPath('icon@32x.png'),
            product_name: APP_CONSTANTS.PRODUCT_NAME,
            copyright: APP_CONSTANTS.COPYRIGHT,
            homepage: APP_CONSTANTS.HOME_PAGE,
            // we pass in packageJson directly
            // otherwise 'about-window' we try load package.json dynamically
            // through require(package_json_dir/package.json).
            // this throw error using vite build system.
            package_json: packageJson as PackageJson,
            package_json_dir: undefined,
            // we copied about.html and relevant css/scripts
            // from 'about-window' module to public folder
            about_page_dir: getPublicPath('about'),
            use_version_info,
            win_options: {
              parent: homeWindowManager.getOrCreate(),
              modal: !Runtime.isMac,
              maximizable: false,
              minimizable: false,
            }
            // open_devtools: true,
          });
        },
      }
    ]
  };
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
          click: () => settingWindowManager.getOrCreate(),
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
    helpMenu,
  ];
  return Menu.buildFromTemplate(template);
}
