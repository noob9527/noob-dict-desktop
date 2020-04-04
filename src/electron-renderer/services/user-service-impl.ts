import { UserService } from '../../common/services/user-service';
import { User } from '../../common/model/user';
import { injectable } from 'inversify';
import { LoginOption } from '../../common/social-login';
import axios from 'axios';


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
}