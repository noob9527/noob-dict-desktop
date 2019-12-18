import { app, Menu, Tray } from 'electron';
import logger from '../../common/utils/logger';
import { showSearchWindow } from '../window/search-window';
import { getAssetsPath } from '../utils/path-util';
import { mainContainer } from '../../common/container/main-container';

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
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = getAssetsPath(iconName);

  const tray = new Tray(iconPath);
  const menu = createMenu();
  tray.setToolTip('Electron Demo in the tray.');
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