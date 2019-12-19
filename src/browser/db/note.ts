type SearchJsonResult = any;

export enum CollectionAction {
  COLLECT = 'COLLECT',
  QUICK_COLLECT = 'QUICK_COLLECT',
}

interface Context {
  paragraph: string
  source: string
  remark: string
}

export interface INote {
  id: Maybe<number>
  text: string
  context: Context[]
  remark: string
  searchResult: SearchJsonResult
  collectAction: CollectionAction
  create_at: Date
  update_at: Maybe<Date>
}

export class Note implements INote {

  id: Maybe<number>;
  text: string = '';
  context = [];
  remark = '';
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