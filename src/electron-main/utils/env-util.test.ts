import { getClientAppId } from './env-util';

describe('env-util', () => {
  describe('getClientAppId', () => {
    it('basic case', async () => {
      const res = await getClientAppId();
      console.log(res);
      expect(res).toBeTruthy();
    });
  });
});
