import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';
import { windowManagerContainer } from './window/window-manager-container';
import logger from '../electron-shared/logger';
import { AutoUpdaterChannel } from '../electron-shared/ipc/ipc-channel-auto-updater';

export {
  initialAutoUpdater,
};

function initialAutoUpdater() {
  // log.transports.file.level = 'info';
  autoUpdater.logger = logger;

  autoUpdater.on(AutoUpdaterChannel.CHECKING_FOR_UPDATE, () => {
    broadcast(AutoUpdaterChannel.CHECKING_FOR_UPDATE);
  });
  autoUpdater.on(AutoUpdaterChannel.UPDATE_AVAILABLE, (info) => {
    broadcast(AutoUpdaterChannel.UPDATE_AVAILABLE, info);
  });
  autoUpdater.on(AutoUpdaterChannel.UPDATE_NOT_AVAILABLE, (info) => {
    broadcast(AutoUpdaterChannel.UPDATE_NOT_AVAILABLE, info);
  });
  autoUpdater.on(AutoUpdaterChannel.ERROR, (err) => {
    broadcast(AutoUpdaterChannel.ERROR, err);
  });
  autoUpdater.on(AutoUpdaterChannel.DOWNLOAD_PROGRESS, (progressObj) => {
    broadcast(AutoUpdaterChannel.DOWNLOAD_PROGRESS, progressObj);
  });
  autoUpdater.on(AutoUpdaterChannel.UPDATE_DOWNLOADED, (info) => {
    broadcast(AutoUpdaterChannel.UPDATE_DOWNLOADED, info);
  });

  // autoUpdater.logger.debug?.call(null, 'checkForUpdatesAndNotify');
  autoUpdater.checkForUpdatesAndNotify();
}

function broadcast(channel: string, data?: any) {
  // log.info(channel, text);
  windowManagerContainer.broadcast(channel, data);
}

