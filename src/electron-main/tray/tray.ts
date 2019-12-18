import { app, Menu, Tray } from 'electron';
import logger from '../../common/utils/logger';
import holder from '../../common/utils/instance-holder';
import { showWindow } from "../window/search-window";
import { getAssetsPath } from "../utils/path-util";

export function ensureTray() {
  holder.setIfAbsent(Tray, createTray);
  return holder.get(Tray);
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
        showWindow();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
        logger.log('app.quit()');
      }
    },
  ]);
}