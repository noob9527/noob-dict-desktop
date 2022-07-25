import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron-better-ipc';
import { WindowId } from '../../common/window-id';
import { WindowEvents } from '../../common/window-events';

function notifyRendererWindowEvents(
  windowId: WindowId,
  eventWindow: BrowserWindow,
  notifyWindow: BrowserWindow = eventWindow,
) {
  WindowEvents.values().forEach(event => {
    const channelName = windowId.getEventChannelName(event);
    eventWindow.on(event as any, e => {
      ipcMain.callRenderer(notifyWindow, channelName);
    });
  });
}

export {
  notifyRendererWindowEvents,
};

