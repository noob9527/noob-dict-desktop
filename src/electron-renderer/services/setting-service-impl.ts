import { SettingService } from "../../browser/services/setting-service";
import { remote, ipcRenderer } from 'electron';
import isDev from "electron-is-dev";
import * as path from "path";
import holder from "../../common/utils/instance-holder";
import { injectable } from "inversify";

const { BrowserWindow } = remote;

@injectable()
export class ElectronSettingService extends SettingService {
  openSettingWindow(): Promise<boolean> {
    // todo
    // gotta do this in main process?
    // https://electronjs.org/docs/api/browser-window#modal-windows
    const parent = holder.get(BrowserWindow);
    console.log(parent);

    let win: any = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        // preload: path.join(__dirname, "preload.js"),
        // https://electronjs.org/docs/faq#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron
        nodeIntegration: true,
        // to disable the cors policy, so that we can fetch resources from different origin
        webSecurity: false,
      },
    });
    win.on('closed', () => {
      win = null;
    });

    // Load a remote URL
    win.loadURL(isDev
      ? 'http://localhost:3000/setting'
      : `file://${path.join(__dirname, '../build/index.html')}`
    );

    return Promise.resolve(true);
  }
}

