export const LocalDbServiceToken = Symbol.for('sqlite-local-db-service');

export interface LocalDbService {
  init()
  fetchAvailable(): Promise<boolean>
}
