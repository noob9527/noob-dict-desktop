import { Context, ISimpleSearchResult } from './search-domain';

export interface ISearchHistory {
  id?: Maybe<number>
  user_id: string
  text: string
  context: Context | null | undefined
  searchResult?: ISimpleSearchResult
  createAt: number
  updateAt: Maybe<number>
}

export class SearchHistory implements ISearchHistory {
  id?: Maybe<number>;
  user_id: string = '';
  text: string = '';
  context = null;
  createAt!: number;
  updateAt: Maybe<number>;
  searchResult?: ISimpleSearchResult;

  static wrap(history: Partial<ISearchHistory>) {
    const res = new SearchHistory();
    Object.assign(res, history);
    return res;
  }

  static create(history: Partial<ISearchHistory>) {
    const res = new SearchHistory();
    Object.assign(res, history);
    const now = (new Date()).getTime();
    res.createAt = now;
    res.updateAt = now;
    delete res.id;
    return res;
  }

  private constructor() {
  }
}