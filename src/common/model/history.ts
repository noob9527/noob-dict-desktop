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
    res.createAt = (new Date()).getTime();
    delete res.id;
    return res;
  }

  private constructor() {
  }
}