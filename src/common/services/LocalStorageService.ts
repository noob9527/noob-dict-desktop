export const LocalStorageServiceToken = Symbol.for('local-storage-service');

export interface LocalStorageService {
  putObject(key: string, value: any)

  getObject(key: string): any | null | undefined

  remove(key: string)
}
