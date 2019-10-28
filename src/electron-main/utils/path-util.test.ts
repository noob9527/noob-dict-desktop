import { getAssetsPath } from './path-util';

describe('path-util', () => {
  it('getAssetsPath', () => {
    const res = getAssetsPath('iconTemplate.png');
    expect(res).toContain('assets/iconTemplate.png');
  });
});