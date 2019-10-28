import database from "./database";
import { INote } from "./note";

const NoteService = {
  save,
  remove,
  findOne,
};

export default NoteService;

async function remove(id: number) {
  return database.notes.delete(id);
}

async function save(note: INote) {
  const res = await database.notes.add(note);
  note.id = res;
  return res;
}

async function findOne(text: string): Promise<Maybe<INote>> {
  return database.notes.where('text').equals(text).first();
}