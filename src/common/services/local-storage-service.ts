export const LocalStorageServiceToken = Symbol.for('local-storage-service');

export interface LocalStorageService {
  putObject<T>(key: string, value: T)

  getObject<T>(key: string): T | null | undefined

  getString(key: string): string | null | undefined

  putString(key: string, value: string)

  remove(key: string)
}
