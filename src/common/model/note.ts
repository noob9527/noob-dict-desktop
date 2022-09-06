import { ISearchHistory } from './history';


// note is just histories group by text
export interface INote {
  id?: Maybe<number>
  user_id: string
  text: string
  remark: string
  create_at: number
  update_at: number
  update_times: number // In general, the more update times, the more significant a word is
  // extra
  histories: ISearchHistory[]
}

export class Note implements INote {
  id?: Maybe<number>;
  user_id: string = '';
  text: string = '';
  remark = '';
  create_at!: number;
  update_at!: number;
  update_times = 0;
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
    // res.create_at = (new Date()).getTime();
    // res.update_at = res.create_at;
    return res;
  }

  private constructor() {
  }
}
