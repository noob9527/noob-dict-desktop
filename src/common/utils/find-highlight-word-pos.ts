export function findHighlightWordPos(
  sentence: string,
  highlightWords: string[]
): [number, number][] {
  const regExps = highlightWords
    .map(e => new RegExp(`\\b${escapeRegExpFn(e)}\\b`, 'ig'))

  let res: [number, number][] = [];
  regExps.forEach(e => {
    res = res.concat(Array.from(sentence.matchAll(e))
      .map(result => {
        return [result.index!!, result.index!! + result[0].length];
      }));
  });
  return res;
}

/**
 * copied from https://github.com/bvaughn/highlight-words-core/blob/master/src/utils.js
 * @param string
 */
function escapeRegExpFn (string: string): string {
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
