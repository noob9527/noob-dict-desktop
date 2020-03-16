// import { app, BrowserWindow } from 'electron';
// import { mainContainer } from '../../common/container/main-container';
// import { getOrCreateSearchWindow } from './search-window';
// import { getWindowHashUrl } from '../utils/path-util';
// import logger from '../../common/utils/logger';
// import { windowContainer } from './windows';
// import { WindowId } from '../../common/window-constants';
//
// export {
//   getOrCreateVersionWindow,
// };
//
// function getOrCreateVersionWindow() {
//   // eslint-disable-next-line no-undef
//   return windowContainer.find(WindowId.VERSION)
//     ?? windowContainer.add(WindowId.VERSION, createWindow());
// }
//
// function destroy() {
//   windowContainer.remove(WindowId.VERSION);
// }
//
// function createWindow() {
//   const window = new BrowserWindow({
//     modal: true,
//     resizable: false,
//     parent: getOrCreateSearchWindow(),
//   });
//   window.setMenuBarVisibility(false);
//   window.loadURL(getWindowHashUrl('version'));
//
//   window.on('closed', () => {
//     destroy();
//     logger.log(`${WindowId.VERSION} closed`);
//   });
//   return window;
// }
//
