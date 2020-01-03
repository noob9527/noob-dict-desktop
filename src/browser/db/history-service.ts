import database from '../../electron-renderer/services/db/database';
import { IHistory } from '../../common/model/history';

const HistoryService = {
  save,
  findAll,
};

export default HistoryService;

async function save(history: IHistory) {
  const res = await database.histories.add(history);
  history.id = res;
  return res;
}

async function findAll(text: string): Promise<IHistory[]> {
  return database.histories.where('text').equals(text).toArray()
}
