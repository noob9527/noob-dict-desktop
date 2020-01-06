interface Context {
  paragraph: string
  source: string
  remark: string
}

export interface ISearchHistory {
  id?: Maybe<number>
  text: string
  context: Context[]
  createAt: number
  updateAt: Maybe<number>
}

export class SearchHistory implements ISearchHistory {
  id?: Maybe<number>;
  text: string = '';
  context: Context[] = [];
  createAt!: number;
  updateAt: Maybe<number>;

  constructor(history: Partial<ISearchHistory>) {
    Object.assign(this, history);
    this.createAt = (new Date()).getTime();
    delete this.id; // this line is necessary, otherwise indexed db throw an error
  }
}