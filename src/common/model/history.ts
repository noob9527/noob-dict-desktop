interface Context {
  paragraph: string
  source: string
  remark: string
}

export interface IHistory {
  id?: Maybe<number>
  noteId: number
  text: string
  context: Context[]
  createAt: Date
  updateAt: Maybe<Date>
}

export class History implements IHistory {
  id?: Maybe<number>;
  noteId = 0;
  text: string = '';
  context: Context[] = [];
  createAt!: Date;
  updateAt: Maybe<Date>;

  constructor(history: Partial<IHistory>) {
    Object.assign(this, history);
    this.createAt = new Date();
    delete this.id; // this line is necessary, otherwise indexed db throw an error
  }
}