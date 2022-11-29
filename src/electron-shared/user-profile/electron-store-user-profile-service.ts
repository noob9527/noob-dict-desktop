import { UserProfileService } from './user-profile-service';
import { UserProfile } from './user-profile';
import ElectronStore from 'electron-store';
import { getDefaultUserProfile } from './default-user-profile-util';


export class ElectronStoreUserProfileService implements UserProfileService {

  private static store: ElectronStore<UserProfile>;
  private static _instance: ElectronStoreUserProfileService;

  /**
   * should be invoked separately in main process and renderer process.
   */
  static init() {
    if (ElectronStoreUserProfileService._instance!=null)
      return ElectronStoreUserProfileService._instance;
    const defaultProfile = getDefaultUserProfile();
    ElectronStoreUserProfileService._instance = new ElectronStoreUserProfileService(
      new ElectronStore({ defaults: defaultProfile, })
    );
  }

  static instance(): ElectronStoreUserProfileService {
    return this._instance;
  }

  private constructor(
    private store: ElectronStore<UserProfile>,
  ) {
  }

  getProfile(): UserProfile {
    return this.store.store;
  }

  setProfile(profile: UserProfile) {
    this.store.store = profile;
  }

}
