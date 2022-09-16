import database from './dexie-index-db';

describe('database', () => {
  it('isOpen', async () => {
    await database.open();
    const res = database.isOpen();
    expect(res).toBeTruthy();
  });
});
