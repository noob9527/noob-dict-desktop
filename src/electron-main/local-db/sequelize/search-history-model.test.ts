import { SearchHistoryModel } from './search-history-model';
import { NoobDictDB } from './noob-dict-db';
import { Op } from 'sequelize';

const dbFilePath = '/tmp/set_your_db_file_path_here';

const testObj = {
  'id': 3035145,
  'text': 'test',
};

describe.skip('stardict model', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const noobDictDB = new NoobDictDB(dbFilePath);
  it('basic case', async () => {
    await noobDictDB.testDbConnection()
    const res = await SearchHistoryModel.findAll({
      where: {
        update_at: {
          [Op.between]: [
            1721704681589,
            undefined,
          ],
        }
      },
    }).then(e => e.map(m => m.toDTO()));
    console.log(res)
  });
});
