import { Context } from './search-domain';

export interface ISearchHistory {
  id?: Maybe<string>
  user_id: string
  text: string
  context: Context | null | undefined
  create_at: number
  update_at: number
}

export class SearchHistory implements ISearchHistory {
  id?: Maybe<string>;
  user_id: string = '';
  text: string = '';
  context = null;
  create_at!: number;
  update_at!: number;

  static wrap(history: Partial<ISearchHistory>) {
    const res = new SearchHistory();
    Object.assign(res, history);

    // server may send iso 8601 format string
    // noinspection SuspiciousTypeOfGuard
    if (typeof res.create_at == 'string') {
      res.create_at = new Date(res.create_at).valueOf()
    }
    // noinspection SuspiciousTypeOfGuard
    if (typeof res.update_at == 'string') {
      res.update_at = new Date(res.update_at).valueOf()
    }

    return res;
  }

  static create(history: Partial<ISearchHistory>) {
    const res = new SearchHistory();
    Object.assign(res, history);
    // const now = (new Date()).valueOf();
    // res.create_at = now;
    // res.update_at = now;
    return res;
  }

  private constructor() {
  }
}
