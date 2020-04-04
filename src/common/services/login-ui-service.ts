export const LoginUiServiceToken = Symbol.for('login-ui-service');

export interface LoginUiService {
  open(): Promise<boolean>
}
