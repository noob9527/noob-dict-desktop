import { Definition } from '@noob9527/noob-dict-core/dist/lib-esm/shared/model/search-model';
import { SearchSuccessResult } from '@noob9527/noob-dict-core';

type SimpleDefinition = Omit<Definition, 'examples'>

export interface ISimpleSearchResult {
  definitions: SimpleDefinition[];
}

export interface Context {
  paragraph: string
  source: string
  remark: string
}

export function simplifyResult(searchResult: SearchSuccessResult) {
  const definitions = searchResult.definitions.map(e => ({
    ...e,
    examples: undefined,
  }));
  return { definitions };
}

