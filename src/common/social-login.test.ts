import { extractCode } from './social-login';

describe('social login', () => {
  describe('extractCode', () => {
    it('basic case', () => {
      const url = 'http://localhost:3000/?code=d63d3aaf36320b31268f';
      const code = extractCode(url);
      expect(code).toBe('d63d3aaf36320b31268f');
    });
  });
});
