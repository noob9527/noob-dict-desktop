import { SearchHistoryModel } from './search-history-model';
import { NoobDictDB } from './noob-dict-db';

const dbFilePath = '';

const testObj = {
  'id': 3035145,
  'text': 'test',
};

describe('stardict model', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const noobDictDB = new NoobDictDB(dbFilePath);

  describe('toSuggest', () => {
    it('basic case', () => {
      const expectRes = {
        id: 3035145,
        word: 'test',
        sw: 'test',
        phonetic: 'test',
        definition: 'n. any standardized procedure for measuring sensitivity or memory or intelligence or aptitude or personality etc\n' +
          'n. the act of undergoing testing\n' +
          'n. the act of testing something\n' +
          'n. a hard outer covering as of some amoebas and sea urchins',
        translation: 'n. 测试, 试验, 化验, 检验, 考验, 甲壳\nvt. 测试, 试验, 化验\nvi. 接受测验, 进行测试',
        pos: 'v:36/n:64',
        collins: 5,
        oxford: true,
        tag: 'zk gk cet4 cet6 ky ielts',
        bnc: 627,
        frq: 575,
        exchange: 's:tests/d:tested/i:testing/p:tested/3:tests',
        detail: null,
        audio: '',
        entry: 'test',
        explain: 'n. 测试, 试验, 化验, 检验, 考验, 甲壳; vt. 测试, 试验, 化验; vi. 接受测验, 进行测试'
      };
      const record = SearchHistoryModel.build(testObj);
      expect(record).toStrictEqual(expectRes);
    });
  });

});
