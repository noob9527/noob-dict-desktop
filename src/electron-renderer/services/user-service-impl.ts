import { UserService } from '../../common/services/user-service';
import { User } from '../../common/model/user';
import { injectable } from 'inversify';
import { LoginOption } from '../../common/social-login';
import { LocalStorageService, LocalStorageServiceToken } from '../../common/services/local-storage-service';
import { rendererContainer } from '../../common/container/renderer-container';
import logger from '../../electron-shared/logger';
import { AppService, AppServiceToken } from '../../common/services/app-service';
import { apiAxios } from '../utils/api-axios';

const USER_KEY = 'currentUser';

// this implementation only works if you can circumvent the CORS problem
@injectable()
export class CorsUserService implements UserService {

  private localStorageService: LocalStorageService;
  private appService: AppService;

  constructor() {
    this.localStorageService = rendererContainer.get<LocalStorageService>(LocalStorageServiceToken);
    this.appService = rendererContainer.get<AppService>(AppServiceToken);
  }

  async login(code: string, option: LoginOption): Promise<User> {
    const res = await apiAxios.post(option.tokenExchangeUrl, {
      code,
      redirect_uri: option.params.redirect_uri
    });
    const user = res.data;
    if (!user.id) {
      logger.error('option:', option);
      logger.error('res:', res);
      throw Error('login failed');
    }
    // we remove last_sync_time here, otherwise won't able to fetch latest update item
    // this may take a long while to finish
    user.last_sync_time = (new Date(0)).toISOString();
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
    this.localStorageService.remove(USER_KEY);
  }

  private async getLastEvaluatedUpdateAtKey() :Promise<string|null>{
    const user = this.fetchCurrentUserFromStorage();
    const user_id = user?.id;
    if (!user_id) return Promise.resolve(null);
    const client_app_id= await this.appService.getClientAppId();
    return `${user_id}:${client_app_id}:LAST_EVALUATED_UPDATE_AT`;
  }

  async getLastEvaluatedUpdateAt(): Promise<Date | null> {
    const key = await this.getLastEvaluatedUpdateAtKey();
    if (!key) return Promise.resolve(null);
    const value = this.localStorageService.getString(key);
    if (!value) return Promise.resolve(null);
    return new Date(value);
  }

  async setLastEvaluatedUpdateAt(date: Date) {
    const key = await this.getLastEvaluatedUpdateAtKey();
    if (!key) return Promise.reject('failed to get current user');
    this.localStorageService.putString(key, date.toISOString());
  }

  getLastSyncTime(): Promise<Date | null> {
    const user = this.fetchCurrentUserFromStorage();
    if (user == null)
      return Promise.resolve(null);
    else
      return Promise.resolve(new Date(user!!.last_sync_time));
  }

  async setLastSyncTime(date: Date): Promise<void> {
    await this.patchCurrentUser({
      last_sync_time: date.toISOString()
    });
  }

  async setLastEvaluatedUpdateAtAndLastSyncTime(date: Date): Promise<void> {
    await this.setLastEvaluatedUpdateAt(date);
    await this.setLastSyncTime(date);
  }

}
