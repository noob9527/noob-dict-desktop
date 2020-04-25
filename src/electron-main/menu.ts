/**
 * reference:
 * - https://www.electronjs.org/docs/api/menu
 * - https://github.com/electron/electron/blob/master/lib/browser/default-menu.ts
 * - https://github.com/rhysd/electron-about-window
 */
import { Menu } from 'electron';
import { mainContainer } from '../common/container/main-container';
import openAboutWindow from 'about-window';
import { getAssetsPath, getBuildPath } from './utils/path-util';
import { APP_CONSTANTS } from '../common/app-constants';
import gitInfo from './utils/git-info';
import { getOrCreateSearchWindow } from './window/search-window';
import { Platform } from './utils/platform-util';
import { getOrCreateSettingWindow } from './window/setting-window';
import { getOrCreateLoginWindow } from './window/login-window';
import { getOrCreateDeveloperWindow } from './window/debug-window';

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
  const helpMenu: Electron.MenuItemConstructorOptions = {
    role: 'help',
    submenu: [
      {
        label: 'About',
        click: () => {
          openAboutWindow({
            icon_path: getAssetsPath('icon@32x.png'),
            product_name: APP_CONSTANTS.PRODUCT_NAME,
            copyright: APP_CONSTANTS.COPYRIGHT,
            homepage: APP_CONSTANTS.HOME_PAGE,
            package_json_dir: getBuildPath(),
            use_version_info: [
              ...['electron', 'chrome', 'node', 'v8']
                .map(e => [e, process.versions[e]]).filter(Boolean),
              ['git', gitInfo.version],
            ],
            win_options: {
              parent: getOrCreateSearchWindow(),
              model: true,
            }
            // open_devtools: true,
          });
        },
      }
    ]
  };
  const macAppMenu: Electron.MenuItemConstructorOptions = { role: 'appMenu' };
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(Platform.isMac ? [macAppMenu] : []),
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
    helpMenu
  ];
  return Menu.buildFromTemplate(template);
}
