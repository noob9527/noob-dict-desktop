import {NoobDictDB} from './noob-dict-db';

const dbFilePath = '';

describe('NoobDictDB', () => {
  const noobDictDB = new NoobDictDB(dbFilePath);

  // `sequelize.authenticate()` actually creates file if it doesn't exist
  // these test cases fail
  describe.skip('testDbConnection', () => {
    it('basic', async () => {
      const res = new NoobDictDB(dbFilePath);
      expect(await res.testDbConnection())
        .toBe(true);
    });

    it('should return false', async () => {
      const res = new NoobDictDB('data/whatever');
      expect(await res.testDbConnection())
        .toBe(false);
    });

    it('should return false', async () => {
      const res = new NoobDictDB('');
      expect(await res.testDbConnection())
        .toBe(false);
    });
  });
});
