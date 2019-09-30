import * as path from "path";
import { ipcMain, app, Tray, Menu } from 'electron';
import { TrayChannel } from "../src/shared/tray/tray-channel";

let appIcon: Tray;

ipcMain.on(TrayChannel.PUT_IN_TRAY, (event: any) => {
  // todo show icon bug
  // (electron:31101): libappindicator-WARNING **: 18:59:31.347: Using '/tmp' paths in SNAP environment will lead to unreadable resources
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, iconName);
  appIcon = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Remove',
    click: () => {
      event.sender.send('tray-removed');
    }
  }]);

  appIcon.setToolTip('Electron Demo in the tray.');
  appIcon.setContextMenu(contextMenu);
});

ipcMain.on(TrayChannel.REMOVE_TRAY, () => {
  console.log('remove');
  // todo tray won't be destroyed on ubuntu
  // https://github.com/electron/electron/issues/17622
  // alt + f2,  r
  appIcon.destroy();
});

app.on('window-all-closed', () => {
  if (appIcon) appIcon.destroy();
});
