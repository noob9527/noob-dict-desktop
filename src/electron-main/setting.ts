import { ipcMain } from 'electron-better-ipc';
import { getOrCreateSearchWindow, toggleSearchWindow } from './window/search-window';
import { GlobalShotCutChannel, SettingChannel } from '../common/ipc-channel';
import { globalShortcut } from 'electron';
import { UserProfile } from '../electron-shared/user-profile/user-profile';
import logger from '../electron-shared/logger';
import { handleEcDictFileLocationChange } from './ecdict';
import { ElectronStoreUserProfileService } from '../electron-shared/user-profile/electron-store-user-profile-service';

export function initSetting() {
  ElectronStoreUserProfileService.init();
  const setting = ElectronStoreUserProfileService
    .instance().getProfile();
  console.log(setting);
  if (setting.appHotKey) {
    handleAppHotKeyChange(setting.appHotKey);
  }
  handleEcDictFileLocationChange(setting.ecDictFileLocation);
}

// called by setting window
// -> setting window
// -> ElectronSettingService.sendSettingChange
// -> src/electron-main/setting.ts
// -> src/browser/ipc-renderer.ts registerStorageEventListener
// -> ElectronSettingService.handleSettingChange
export async function handleSettingChange(newValue: UserProfile, oldValue: UserProfile): Promise<UserProfile> {
  newValue.appHotKey = handleAppHotKeyChange(newValue.appHotKey, oldValue.appHotKey);

  handleEcDictFileLocationChange(
    newValue.ecDictFileLocation,
    oldValue.ecDictFileLocation
  );

  ElectronStoreUserProfileService.instance().setProfile(newValue); // sync to electron store
  const res = await ipcMain.callRenderer(getOrCreateSearchWindow(), SettingChannel.SETTING_CHANGE, {
    newValue,
    oldValue,
  });
  return res as UserProfile;
}

// https://electronjs.org/docs/api/global-shortcut
function handleAppHotKeyChange(newValue: string | null, oldValue: string | null = null) {
  if (newValue===oldValue) return newValue;
  if (oldValue) {
    globalShortcut.unregister(oldValue);
    logger.log(`${oldValue} unregister success`);
  }
  if (newValue) {
    const success = globalShortcut.register(newValue, async () => {
      // toggleSearchWindow();
      // we send the message to renderer process
      // then let the renderer process send back to main process
      // because we need the information about isSettingWindowOpen...
      // it's over complicated...
      return ipcMain.callRenderer(getOrCreateSearchWindow(), GlobalShotCutChannel.APP_HOT_KEY_PRESSED);
    });
    if (success) {
      logger.log(`${newValue} register success`);
    } else {
      logger.error(`${newValue} register failed`);
    }
    return success ? newValue:null;
  }
  return newValue;
}
