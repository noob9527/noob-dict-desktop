import { injectable } from 'inversify';
import { LocalStorageService } from '../../common/services/local-storage-service';


// this implementation only works if you can circumvent the CORS problem
@injectable()
export class LocalStorageServiceImpl implements LocalStorageService {
  getObject(key: string): any | null | undefined {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value):null;
  }

  putObject(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  getString(key: string): string | null | undefined {
    return localStorage.getItem(key);
  }

  putString(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}
