import { SearchHistoryModel } from './search-history-model';
import { NoobDictDB } from './noob-dict-db';

const dbFilePath = '';

const testObj = {
  'id': 3035145,
  'text': 'test',
};

describe.skip('stardict model', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const noobDictDB = new NoobDictDB(dbFilePath);
  it('basic case', () => {
    // pass
  });
});
