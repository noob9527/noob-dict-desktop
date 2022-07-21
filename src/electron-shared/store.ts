import ElectronStore from 'electron-store';
import { UserProfile } from '../common/model/user-profile';

export const store = new ElectronStore<UserProfile>();
