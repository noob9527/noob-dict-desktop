import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';
import { AutoUpdaterChannel } from '../common/ipc-channel';
import { windowContainer } from './window/windows';
import logger from '../common/utils/logger';

export {
  initialAutoUpdater,
};

function initialAutoUpdater() {
  // log.transports.file.level = 'info';
  autoUpdater.logger = logger;

  autoUpdater.on(AutoUpdaterChannel.CHECKING_FOR_UPDATE, (info) => {
    broadcast(AutoUpdaterChannel.CHECKING_FOR_UPDATE, info);
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

function broadcast(channel: string, text: string = '') {
  // log.info(channel, text);
  windowContainer.broadcast(channel, text);
}

