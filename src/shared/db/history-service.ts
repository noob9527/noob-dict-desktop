import database from "./database";
import { IHistory } from "./history";

export {
  save
}

function save(history: IHistory) {
  console.log('save:', history);
  return database.histories.add(history);
}
