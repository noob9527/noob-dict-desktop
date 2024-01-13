import { UserProfile } from './user-profile';
import { getDefaultLocalDBPath } from '../path-util';


export function getDefaultUserProfile(): UserProfile {
  return {
    appHotKey: '',
    readClipboard: false,
    ecDictFileLocation: null,
    dbFileLocation: getDefaultLocalDBPath(),
  };
}
