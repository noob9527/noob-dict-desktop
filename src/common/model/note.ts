import { ISearchHistory } from './history';
import { ISimpleSearchResult } from './search-domain';


// note is just histories group by text
export interface INote {
  id: Maybe<number>
  user_id: string
  text: string
  remark: string
  createAt: number
  updateAt: Maybe<number>
  updateTimes: number // In general, the more update times, the more significant a word is
  searchResult?: ISimpleSearchResult
  // extra
  histories: ISearchHistory[]
}

export class Note implements INote {

  id: Maybe<number>;
  user_id: string = '';
  text: string = '';
  remark = '';
  createAt!: number;
  updateAt: Maybe<number>;
  updateTimes = 0;
  searchResult?: ISimpleSearchResult;
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
    res.updateAt = res.createAt;
    delete res.id;
    return res;
  }

  private constructor() {
  }
}
