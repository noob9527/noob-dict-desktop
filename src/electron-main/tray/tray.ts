import { app, Menu, Tray } from 'electron';
import logger from '../../electron-shared/logger';
import { showSearchWindow } from '../window/search-window';
import { getIconPath } from '../../electron-shared/path-util';
import { mainContainer } from '../../common/container/main-container';
import { APP_CONSTANTS } from '../../common/app-constants';

export {
  getOrCreateTray,
};

const TrayToken = Symbol.for('tray');
mainContainer.bind<Tray>(TrayToken)
  .toDynamicValue(createTray)
  .inSingletonScope();

function getOrCreateTray() {
  return mainContainer.get<Tray>(TrayToken);
}

function createTray() {
  const iconName = 'icon.png';
  const iconPath = getIconPath(iconName);

  const tray = new Tray(iconPath);
  const menu = createMenu();
  tray.setToolTip(APP_CONSTANTS.PRODUCT_NAME);
  tray.setContextMenu(menu);

  tray.on('click', () => {
    // this event doesn't work on my machine(ubuntu)
    logger.log('click');
  });

  return tray;
}

function createMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        logger.log('show');
        showSearchWindow();
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
        logger.log('app.quit()');
      },
    },
  ]);
}
