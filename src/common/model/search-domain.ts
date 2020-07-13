import { Definition, Pronunciation, WordForm } from '@noob9527/noob-dict-core/dist/lib-esm/shared/model/search-model';
import { SearchSuccessResult } from '@noob9527/noob-dict-core';

type SimpleDefinition = Omit<Definition, 'examples'>

export interface ISimpleSearchResult {
  wordForms: WordForm[]
  pronunciations: Pronunciation[]
  definitions: SimpleDefinition[];
}

export interface Context {
  paragraph: string
  source: string
  remark: string
}

export function simplifyResult(search_result: SearchSuccessResult) {
  const definitions = search_result.definitions.map(e => ({
    ...e,
    examples: undefined,
  }));
  return {
    wordForms: search_result.wordForms,
    pronunciations: search_result.pronunciations,
    definitions,
  };
}

