import { getIconPath, getPublicPath, getUserDataPath } from './path-util';

describe('path-util', () => {
  it('getAssetsPath', () => {
    const res = getIconPath('iconTemplate.png');
    expect(res).toContain('assets/icon/iconTemplate.png');
  });
  it('getUserDataPath', () => {
    const res = getUserDataPath('DB.sqlite');
    console.log(res);
  });

  it('getPublicPath', () => {
    const res = getPublicPath();
    console.log(res);
  });

});
