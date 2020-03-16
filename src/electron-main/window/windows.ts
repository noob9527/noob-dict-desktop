import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron-better-ipc';
import { WindowId } from '../../common/window-constants';

class WindowContainer {
  private map: Map<WindowId, BrowserWindow> = new Map();

  add(id: WindowId, window: BrowserWindow): BrowserWindow {
    this.map.set(id, window);
    return window;
  }

  find(id: WindowId): BrowserWindow | undefined {
    return this.map.get(id);
  }

  remove(id: WindowId) {
    this.map.delete(id);
  }

  broadcast(channel: string, data?: any): Promise<unknown> {
    const promises = this.all()
      .map(window => ipcMain.callRenderer(window, channel, data));
    return Promise.all(promises);
  }

  private all(): BrowserWindow[] {
    return Array.from(this.map).map(([key, value]) => value)
  }

}

const windowContainer = new WindowContainer();

export {
  windowContainer,
}
