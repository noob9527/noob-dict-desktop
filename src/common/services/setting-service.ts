import { UserProfile } from '../../electron-shared/user-profile/user-profile';

export const SettingServiceToken = Symbol.for('setting-service');

export interface SettingService {
  initSetting(): Promise<UserProfile>

  // called by setting window
  // -> setting window
  // -> ElectronSettingService.sendSettingChange
  // -> src/electron-main/setting.ts
  // -> src/browser/ipc-renderer.ts registerStorageEventListener
  // -> ElectronSettingService.handleSettingChange
  sendSettingChange(newValue: UserProfile, oldValue: UserProfile): Promise<UserProfile>

  // called by search window
  handleSettingChange(newValue: UserProfile, oldValue: UserProfile | null): Promise<UserProfile>
}
