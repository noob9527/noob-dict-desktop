import { ISearchHistory } from './history';


export interface INote {
  id: Maybe<number>
  text: string
  remark: string
  createAt: number
  updateAt: Maybe<number>
  updateTimes: number // In general, the more update times, the more significant a word is
  searchResult?: any
  // extra
  histories: ISearchHistory[]
}

export class Note implements INote {

  id: Maybe<number>;
  text: string = '';
  remark = '';
  createAt!: number;
  updateAt: Maybe<number>;
  updateTimes = 0;
  searchResult?: any;
  // extra
  histories: ISearchHistory[] = [];

  constructor(note: Partial<INote>) {
    Object.assign(this, note);
    this.createAt = (new Date()).getTime();
    delete this.id; // this line is necessary, otherwise indexed db throw an error
  }
}