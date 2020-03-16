export const AppServiceToken = Symbol.for('app-service');

export interface AppService {
  getVersion(): string
  getProcess(): NodeJS.Process
}