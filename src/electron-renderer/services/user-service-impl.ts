import { UserService } from '../../common/services/user-service';
import { User } from '../../common/model/user';
import { injectable } from 'inversify';
import { LoginOption } from '../../common/social-login';
import axios from 'axios';
import { LocalStorageService, LocalStorageServiceToken } from '../../common/services/LocalStorageService';
import { rendererContainer } from '../../common/container/renderer-container';

const USER_KEY = 'currentUser';

// this implementation only works if you can circumvent the CORS problem
@injectable()
export class CorsUserService implements UserService {

  private localStorageService: LocalStorageService;

  constructor() {
    this.localStorageService = rendererContainer.get<LocalStorageService>(LocalStorageServiceToken);
  }

  async login(code: string, option: LoginOption): Promise<User> {
    const res = await axios.post(option.tokenExchangeUrl, {
      code,
      redirect_uri: option.params.redirect_uri
    });
    const user = res.data;
    // we remove last_sync_time here, otherwise won't able to fetch latest update item
    // this may take a long while to finish
    user.last_sync_time = (new Date(0)).toISOString()
    this.localStorageService.putObject(USER_KEY, user);
    return user;
  }

  // note this doesn't work in main process
  // https://stackoverflow.com/questions/50205905/is-it-possible-to-access-and-read-localstorage-for-an-electron-application
  fetchCurrentUserFromStorage(): User | null | undefined {
    return this.localStorageService.getObject(USER_KEY);
  }

  patchCurrentUser(patch: Partial<User>): User {
    const user = this.fetchCurrentUserFromStorage()!!;
    Object.assign(user, patch);
    this.localStorageService.putObject(USER_KEY, user);
    return user;
  }

  logout() {
    this.localStorageService.remove(USER_KEY)
  }

}