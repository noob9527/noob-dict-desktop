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

  static wrap(note: Partial<INote>): Note {
    const res = new Note();
    Object.assign(res, note);
    return res;
  }

  static create(note: Partial<INote>): Note {
    const res = new Note();
    Object.assign(res, note);
    res.createAt = (new Date()).getTime();
    delete res.id;
    return res;
  }

  private constructor() {
  }
}
