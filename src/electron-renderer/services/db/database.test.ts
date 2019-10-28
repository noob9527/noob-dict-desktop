import database from './database';

describe('database', () => {
  it('isOpen', async () => {
    await database.open();
    const res = database.isOpen();
    expect(res).toBeTruthy();
  });
});