import { getIconPath, getUserDataPath } from './path-util';

describe('path-util', () => {
  it('getAssetsPath', () => {
    const res = getIconPath('iconTemplate.png');
    expect(res).toContain('assets/iconTemplate.png');
  });
  it('getUserDataPath', () => {
    const res = getUserDataPath('DB.sqlite');
    console.log(res);
  });
});
