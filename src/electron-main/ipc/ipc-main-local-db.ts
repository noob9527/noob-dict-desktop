import { ipcMain } from 'electron-better-ipc';
import {
  LocalDbChannel,
} from '../../electron-shared/ipc/ipc-channel-local-db';
import { LocalDB } from '../local-db/local-db';
import { ElectronStoreUserProfileService } from '../../electron-shared/user-profile/electron-store-user-profile-service';
import { getDefaultUserProfile } from '../../electron-shared/user-profile/default-user-profile-util';
import { handleSettingChange } from '../setting';
import logger from '../../electron-shared/logger';
import { MainNoteService } from '../services/main-note-service';
import { mainContainer } from '../../common/container/main-container';
import { MainHistoryService } from '../services/main-history-service';
import { MainHistoryServiceToken } from '../../common/services/db/history-service';
import { MainNoteServiceToken } from '../../common/services/db/note-service';
import { registerAllService } from '../services';

registerAllService()
mainContainer.get<MainHistoryService>(MainHistoryServiceToken)
  .startListen();
mainContainer.get<MainNoteService>(MainNoteServiceToken)
  .startListen();

ipcMain.answerRenderer(LocalDbChannel.FETCH_AVAILABLE, async () => {
  logger.debug('answerRenderer', LocalDbChannel.FETCH_AVAILABLE,);
  return LocalDB.isAvailable();
});

ipcMain.answerRenderer(LocalDbChannel.INIT, async () => {
  logger.debug('answerRenderer', LocalDbChannel.INIT);
  const profile = ElectronStoreUserProfileService
    .instance().getProfile();

  // set profile.dbFileLocation to default dbFileLocation
  if (!profile.dbFileLocation) {
    const defaultUserProfile = getDefaultUserProfile();
    const newProfile = Object.assign(
      {},
      profile,
      { dbFileLocation: defaultUserProfile.dbFileLocation }
    );
    handleSettingChange(newProfile, profile);
  }

  // init
  if (profile.dbFileLocation) {
    LocalDB.initDb(profile.dbFileLocation);
  }
});

