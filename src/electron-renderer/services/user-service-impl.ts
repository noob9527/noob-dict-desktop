import { UserService } from '../../common/services/user-service';
import { User } from '../../common/model/user';
import { injectable } from 'inversify';
import { LoginOption } from '../../common/social-login';
import axios from 'axios';
import { storage } from '../../browser/utils/storage';


// this implementation only works if you can circumvent the CORS problem
@injectable()
export class CorsUserService implements UserService {
  async login(code: string, option: LoginOption): Promise<User> {
    const res = await axios.post(option.tokenExchangeUrl, {
      code,
      redirect_uri: option.params.redirect_uri
    });
    return res.data;
  }

  // note this doesn't work in main process
  // https://stackoverflow.com/questions/50205905/is-it-possible-to-access-and-read-localstorage-for-an-electron-application
  fetchCurrentUser(): Promise<User | null | undefined> {
    return storage.getObject('currentUser');
  }
}