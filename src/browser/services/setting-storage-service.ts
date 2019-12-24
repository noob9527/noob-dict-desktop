export const SettingStorageServiceToken = Symbol.for('setting-storage-service');

export interface SettingStorageService {
  getSettingStorage()

  onDidAnyChange(callback: (newValue, oldValue) => void)
}