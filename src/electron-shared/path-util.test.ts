import { getIconPath } from './path-util';

describe('path-util', () => {
  it('getAssetsPath', () => {
    const res = getIconPath('iconTemplate.png');
    expect(res).toContain('assets/iconTemplate.png');
  });
});