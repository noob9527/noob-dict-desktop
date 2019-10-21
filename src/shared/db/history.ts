import { SearchJsonResult } from 'noob-dict-core';

export interface IHistory {
  id?: Maybe<number>
  text: string
  searchResult: SearchJsonResult
  create_at: Date
  update_at: Maybe<Date>
}

export class History implements IHistory {
  id?: Maybe<number>;
  text: string = '';
  searchResult!: SearchJsonResult;
  create_at!: Date;
  update_at: Maybe<Date>;

  constructor(history: Partial<IHistory>) {
    Object.assign(this, history);
    this.create_at = new Date();
    delete this.id; // this line is necessary, otherwise indexed db throw an error
    console.log(this);
  }
}