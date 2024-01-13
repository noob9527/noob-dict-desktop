import { SettingService } from '../../common/services/setting-service';
import { injectable } from 'inversify';
import { ipcRenderer } from 'electron-better-ipc';
import { UserProfile } from '../../electron-shared/user-profile/user-profile';
import { ClipboardService, ClipboardServiceToken } from '../../common/services/clipboard-service';
import { rendererContainer } from '../../common/container/renderer-container';
import { getCurrentWindowId } from '../../browser/utils/window-utils';
import { WindowId } from '../../common/window-id';
import { ElectronStoreUserProfileService } from '../../electron-shared/user-profile/electron-store-user-profile-service';
import { SettingChannel } from '../../electron-shared/ipc/ipc-channel-setting';

@injectable()
export class ElectronSettingService implements SettingService {
  private clipboardService: ClipboardService;

  constructor() {
    // somehow I'm not able to use @inject here
    this.clipboardService = rendererContainer.get<ClipboardService>(ClipboardServiceToken);
  }

// called by setting window
// -> setting window
// -> ElectronSettingService.sendSettingChange
// -> ipc call main
// -> src/electron-main/setting.ts (this method)
// -> ipc call renderer
// -> ElectronSettingService.handleSettingChange
// -> dispatch redux event
  async sendSettingChange(newValue: UserProfile, oldValue: UserProfile): Promise<UserProfile> {
    return ipcRenderer
      .callMain<{ newValue: UserProfile, oldValue: UserProfile }, UserProfile>(
        SettingChannel.SETTING_CHANGE,
        { newValue, oldValue }
      );
  }

  async handleSettingChange(newValue: UserProfile, oldValue: UserProfile | null): Promise<UserProfile> {
    // if (!newValue.watchSelection) {
    //   this.clipboardService.stopListening();
    // } else {
    //   this.clipboardService.startListening();
    // }
    return newValue;
  }

  async initSetting(): Promise<UserProfile> {
    ElectronStoreUserProfileService.init();
    const res = ElectronStoreUserProfileService
      .instance()
      .getProfile();
    if (getCurrentWindowId()===WindowId.SEARCH) {
      await this.handleSettingChange(res, null);
    }
    return res as UserProfile;
  }
}
