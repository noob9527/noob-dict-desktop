interface Context {
  paragraph: string
  source: string
  remark: string
}

export interface ISearchHistory {
  id?: Maybe<number>
  text: string
  context: Context | null | undefined
  createAt: number
  updateAt: Maybe<number>
}

export class SearchHistory implements ISearchHistory {
  id?: Maybe<number>;
  text: string = '';
  context = null;
  createAt!: number;
  updateAt: Maybe<number>;

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