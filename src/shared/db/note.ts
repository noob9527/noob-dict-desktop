import { SearchResult } from "noob-dict-core";

export interface INote {
  id: Maybe<number>;
  text: string;
  searchResult: SearchResult
  create_at: Date
  update_at: Maybe<Date>
}

export class Note implements INote {

  id: Maybe<number>;
  text: string = '';
  searchResult!: SearchResult;
  create_at!: Date;
  update_at: Maybe<Date>;

  constructor(note: Partial<INote>) {
    Object.assign(this, note);
    this.create_at = new Date();
  }
}