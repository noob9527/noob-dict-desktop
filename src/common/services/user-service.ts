import { User } from '../model/user';
import { LoginOption } from '../social-login';

export const UserServiceToken = Symbol.for('user-service');

export interface UserService {
  login(code: string, option: LoginOption): Promise<User>

  fetchCurrentUserFromStorage(): User | null | undefined

  patchCurrentUser(patch: Partial<User>): User

  logout()
}