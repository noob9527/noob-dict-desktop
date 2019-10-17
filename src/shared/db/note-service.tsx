import database from "./database";
import { INote } from "./note";

export {
  save
}

function save(note: INote) {
  return database.notes.add(note);
}