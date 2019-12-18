export const settingServiceToken = Symbol.for('setting-service');

export interface SettingService {
  openSettingWindow(): Promise<boolean>
}
