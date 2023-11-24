import { ipcMain } from 'electron-better-ipc';
import { getOrCreateSearchWindow, toggleSearchWindow } from './window/search-window';
import { globalShortcut } from 'electron';
import { UserProfile } from '../electron-shared/user-profile/user-profile';
import logger from '../electron-shared/logger';
import { handleEcDictFileLocationChange } from './ecdict';
import { LocalDB } from './local-db/local-db';
import { ElectronStoreUserProfileService } from '../electron-shared/user-profile/electron-store-user-profile-service';
import { SettingChannel } from '../electron-shared/ipc/ipc-channel-setting';
import { GlobalShotCutChannel } from '../electron-shared/ipc/ipc-channel-global-shot-cut';
import { getOrCreateSettingWindow } from './window/setting-window';

export function initSetting() {
  ElectronStoreUserProfileService.init();
  const setting = ElectronStoreUserProfileService
    .instance().getProfile();
  if (setting.appHotKey) {
    handleAppHotKeyChange(setting.appHotKey);
  }
  handleEcDictFileLocationChange(setting.ecDictFileLocation);
  LocalDB.handleDbFileLocationChange(setting.dbFileLocation);
}

// called by setting window
// -> setting window
// -> ElectronSettingService.sendSettingChange
// -> ipc call main
// -> src/electron-main/setting.ts (this method)
// -> ipc call renderer
// -> ElectronSettingService.handleSettingChange
// -> dispatch redux event
export async function handleSettingChange(
  newValue: UserProfile,
  oldValue: UserProfile
): Promise<UserProfile> {
  newValue.appHotKey = handleAppHotKeyChange(newValue.appHotKey, oldValue.appHotKey);

  handleEcDictFileLocationChange(
    newValue.ecDictFileLocation,
    oldValue.ecDictFileLocation
  );
  LocalDB.handleDbFileLocationChange(
    newValue.dbFileLocation,
    oldValue.dbFileLocation,
  );

  ElectronStoreUserProfileService.instance().setProfile(newValue); // sync to electron store

  const res = await ipcMain.callRenderer(
    getOrCreateSearchWindow(),
    SettingChannel.SETTING_CHANGE, {
      newValue,
      oldValue,
    });

  // notify setting window as well
  await ipcMain.callRenderer(
    getOrCreateSettingWindow(),
    SettingChannel.SETTING_CHANGE, {
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
