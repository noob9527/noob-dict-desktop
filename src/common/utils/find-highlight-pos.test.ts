import { findHighlightWordPos } from './find-highlight-word-pos';

describe('findHighlightPos', () => {
  it('basic case', () => {
    const res = findHighlightWordPos(
      'foo bar baz quz',
      ['bar']
    );
    expect(res).toStrictEqual([[4, 7]]);
  });
  it('should match word', () => {
    const res = findHighlightWordPos(
      'not',
      ['no']
    );
    expect(res).toStrictEqual([]);
  });
  it('dash', () => {
    const res = findHighlightWordPos(
      '0123 well-known whatever',
      ['well-known']
    );
    expect(res).toStrictEqual([[5, 15]]);
  });
  it('quote', () => {
    const res = findHighlightWordPos(
      'hello, it\'s me',
      ['it\'s']
    );
    expect(res).toStrictEqual([[7, 11]]);
  });

  it('handle unexpected regexp meta char', () => {
    const res = findHighlightWordPos(
      'foo bar baz',
      ['bar*']
    );
    expect(res).toStrictEqual([]);
  });

  it('multiple words', () => {
    const res = findHighlightWordPos(
      'foo bar baz quz',
      ['bar', 'baz']
    );
    expect(res).toStrictEqual([[4, 7], [8, 11]]);
  });
});
