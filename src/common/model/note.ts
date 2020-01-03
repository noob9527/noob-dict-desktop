import { IHistory } from './history';

type SearchJsonResult = any;

export interface INote {
  id: Maybe<number>
  text: string
  remark: string
  searchResult: SearchJsonResult
  createAt: Date
  updateAt: Maybe<Date>
  histories: IHistory[]
  updateTimes: number // In general, the more update times, the more significant a word is
}

export class Note implements INote {

  id: Maybe<number>;
  text: string = '';
  remark = '';
  searchResult!: SearchJsonResult;
  createAt!: Date;
  updateAt: Maybe<Date>;
  histories: IHistory[] = [];
  updateTimes = 0;

  constructor(note: Partial<INote>) {
    Object.assign(this, note);
    this.createAt = new Date();
    delete this.id; // this line is necessary, otherwise indexed db throw an error
  }
}