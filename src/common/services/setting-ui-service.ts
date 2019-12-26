export const SettingUiServiceToken = Symbol.for('setting-ui-service');

export interface SettingUiService {
  open(): Promise<boolean>
}
