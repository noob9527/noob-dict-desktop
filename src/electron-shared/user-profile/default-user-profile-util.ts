import { UserProfile } from './user-profile';
import { getDefaultLocalDBPath } from '../path-util';


export function getDefaultUserProfile(): UserProfile {
  return {
    appHotKey: '',
    readClipboard: false,
    watchSelection: false,
    ecDictFileLocation: null,
    dbFileLocation: getDefaultLocalDBPath(),
  };
}
