import { SettingUiService } from '../../common/services/setting-ui-service';
import { ipcRenderer } from 'electron-better-ipc';
import { injectable } from 'inversify';
import { SettingChannel } from '../../electron-shared/ipc/ipc-channel-setting';


@injectable()
export class ElectronSettingUiService implements SettingUiService {
  async open(): Promise<boolean> {
    const res = await ipcRenderer.callMain(SettingChannel.OPEN_SETTING_WINDOW);
    return res as boolean;
  }
}
