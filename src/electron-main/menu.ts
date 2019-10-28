import { BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';
import { mainContainer } from '../common/container/main-container';

export {
  getOrCreateAppMenu,
}

const AppMenuToken = Symbol.for('app-menu');
mainContainer.bind<Menu>(AppMenuToken).toDynamicValue(createMenu);

function getOrCreateAppMenu() {
  return mainContainer.get<Menu>(AppMenuToken);
}

function createMenu(): Menu {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              // on reload, start fresh and close any old
              // open secondary windows
              if (focusedWindow.id === 1) {
                BrowserWindow.getAllWindows().forEach(win => {
                  if (win.id > 1) win.close()
                })
              }
              focusedWindow.reload()
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I'
            } else {
              return 'Ctrl+Shift+I'
            }
          })(),
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.toggleDevTools();
            }
          }
        },
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [{
        label: 'Learn More',
        click: () => {
          shell.openExternal('http://electron.atom.io')
        }
      }]
    }
  ];
  return Menu.buildFromTemplate(template);
}
