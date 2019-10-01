import { Tray, Menu, app, BrowserWindow } from 'electron';
import * as path from 'path';
import logger from '../../src/shared/utils/logger';
import holder from '../../src/shared/utils/instance-holder';

export default function ensureTray() {
  holder.setIfAbsent(Tray, createTray);
  return holder.get(Tray);
}

function createTray() {
  // todo show icon bug
  // (electron:31101): libappindicator-WARNING **: 18:59:31.347: Using '/tmp' paths in SNAP environment will lead to unreadable resources
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, iconName);

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
        const window = holder.get(BrowserWindow);
        if (window) {
          if (window.isMinimized()) {
            window.restore()
          }
          window.show();
        } else {
          logger.error("somehow window doesn't exist")
        }
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
        logger.log('app.quit()');
      }
    },
  ])
}