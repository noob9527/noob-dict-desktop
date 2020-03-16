import { SettingService } from '../../common/services/setting-service';
import { injectable } from 'inversify';
import { ipcRenderer } from 'electron-better-ipc';
import { SettingChannel } from '../../common/ipc-channel';
import { UserProfile } from '../../common/model/user-profile';
import { ClipboardService, ClipboardServiceToken } from '../../common/services/clipboard-service';
import { rendererContainer } from '../../common/container/renderer-container';
import { store } from '../../electron-shared/store';
import { getWindowId } from '../../browser/utils/window-utils';
import { WindowId } from '../../common/window-constants';

@injectable()
export class ElectronSettingService implements SettingService {
  private clipboardService: ClipboardService;

  constructor() {
    // somehow I'm not able to use @inject here
    this.clipboardService = rendererContainer.get<ClipboardService>(ClipboardServiceToken);
  }

  async sendSettingChange(newValue: UserProfile, oldValue: UserProfile): Promise<UserProfile> {
    const res = await ipcRenderer.callMain(SettingChannel.SETTING_CHANGE, { newValue, oldValue });
    return res as UserProfile;
  }

  async handleSettingChange(newValue: UserProfile, oldValue: UserProfile | null): Promise<UserProfile> {
    if (!newValue.watchSelection) {
      this.clipboardService.stopListening();
    } else {
      this.clipboardService.startListening();
    }
    return newValue;
  }

  async initSetting(): Promise<UserProfile> {
    const res = store.store;
    if (getWindowId() === WindowId.SEARCH) {
      await this.handleSettingChange(res, null);
    }
    return res as UserProfile;
  }
}