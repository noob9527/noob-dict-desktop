import { UserProfile } from '../model/user-profile';

export const SettingServiceToken = Symbol.for('setting-service');

export interface SettingService {
  initSetting(): Promise<UserProfile>

  // called by setting window
  sendSettingChange(newValue: UserProfile, oldValue: UserProfile): Promise<UserProfile>

  // called by search window
  handleSettingChange(newValue: UserProfile, oldValue: UserProfile | null): Promise<UserProfile>
}
