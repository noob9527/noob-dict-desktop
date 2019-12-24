import { SettingStorageService } from '../../browser/services/setting-storage-service';
import { injectable } from 'inversify';
import ElectronStore from 'electron-store';
import createElectronStorage from 'redux-persist-electron-storage';
import { SettingChannel } from '../../common/ipc-channel';
import { ipcRenderer } from 'electron-better-ipc';

const electronStore = new ElectronStore({
  watch: true,
});
const storage = createElectronStorage({
  electronStore,
});

type Callback = (newValue, oldValue) => void;
// const callbacks: Callback[] = [];
let _callback: Callback | null = null;

// as the doc says "Events are only triggered in the same process.
// So you won't get events in the main process if you trigger an event in a renderer process."
// todo: find a better approach
electronStore.onDidAnyChange((newValue, oldValue) => {
  console.log('electronStore.onDidAnyChange');
  ipcRenderer.callMain(SettingChannel.SETTING_CHANGE_R2M, { newValue, oldValue });
});

ipcRenderer.answerMain(SettingChannel.SETTING_CHANGE, (data: any) => {
  console.log('ipcRenderer.answerMain(SettingChannel.SETTING_CHANGE');
  _callback?.call(null, data.newValue, data.oldValue);
});

@injectable()
export class ElectronSettingStorageService implements SettingStorageService {
  getSettingStorage() {
    return storage;
  }

  // for now, this only works in search window
  onDidAnyChange(callback: (newValue, oldValue) => void) {
    console.log('onDidAnyChange');
    _callback = callback;
  }
}