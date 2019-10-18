import { SearchJsonResult } from "noob-dict-core";

export enum CollectionAction {
  COLLECT = "COLLECT",
  QUICK_COLLECT = "QUICK_COLLECT",
}

export interface INote {
  id: Maybe<number>;
  text: string;
  searchResult: SearchJsonResult
  collectAction: CollectionAction,
  create_at: Date
  update_at: Maybe<Date>
}

export class Note implements INote {

  id: Maybe<number>;
  text: string = '';
  searchResult!: SearchJsonResult;
  collectAction!: CollectionAction;
  create_at!: Date;
  update_at: Maybe<Date>;

  constructor(note: Partial<INote>) {
    Object.assign(this, note);
    this.create_at = new Date();
    delete this.id; // this line is necessary, otherwise indexed db throw an error
  }
}