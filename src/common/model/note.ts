import { type ISearchHistory } from './history';
import { EcDictSearchSuccessResult } from '@noob9527/noob-dict-ecdict';


// note is just histories group by text
export interface INote {
  id?: Maybe<string>
  user_id: string
  text: string
  remark: string
  create_at: number
  update_at: number
  update_times: number // In general, the more update times, the more significant a word is
  // extra
  histories: ISearchHistory[]
  ecDictSearchResult: EcDictSearchSuccessResult | null
}

export class Note implements INote {
  id?: Maybe<string>;
  user_id: string = '';
  text: string = '';
  remark = '';
  create_at!: number;
  update_at!: number;
  update_times = 0;
  // extra
  histories: ISearchHistory[] = [];
  ecDictSearchResult: EcDictSearchSuccessResult | null = null;

  static wrap(note: Partial<INote>): Note {
    const res = new Note();
    Object.assign(res, note);
    return res;
  }

  static create(note: Partial<INote>): Note {
    const res = new Note();
    Object.assign(res, note);
    // res.create_at = (new Date()).getTime();
    // res.update_at = res.create_at;
    return res;
  }

  private constructor() {
  }
}
