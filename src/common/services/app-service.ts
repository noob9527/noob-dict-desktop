export const AppServiceToken = Symbol.for('app-service');

export interface AppService {
  getVersion(): string
  getUserDataFolder(): string
  getProcess(): NodeJS.Process
  getClientAppId(): Promise<string>
}
