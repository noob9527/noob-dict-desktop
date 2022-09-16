import { injectable } from 'inversify';
import { UserService } from '../../common/services/user-service';
import { User } from '../../common/model/user';
import { LoginOption } from '../../common/social-login';

@injectable()
export class MockUserService implements UserService {

  login(code: string, option: LoginOption): Promise<User> {
    return Promise.resolve({} as User);
  }

  logout() {
  }

  fetchCurrentUserFromStorage(): User | null | undefined {
    return undefined;
  }

  patchCurrentUser(patch: Partial<User>): User {
    return {} as User;
  }

  setLastEvaluatedUpdateAt(date: Date): Promise<void> {
    return Promise.resolve(undefined);
  }

  getLastEvaluatedUpdateAt(): Promise<Date | null> {
    return Promise.resolve(new Date());
  }

  setLastSyncTime(date: Date): Promise<void> {
    return Promise.resolve(undefined);
  }

  getLastSyncTime(): Promise<Date | null> {
    return Promise.resolve(new Date());
  }

}
