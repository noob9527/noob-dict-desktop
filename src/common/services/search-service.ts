import { SearchOption, SearchResult, Suggest } from '@noob9527/noob-dict-core';

export const CorsSearchServiceToken = Symbol.for('cors-search-service');
export const EcDictSearchServiceToken = Symbol.for('ecdict-search-service');
export const EcDictId = 'ECDICT';

export interface SearchService {
  fetchSuggests(text: string, option?: SearchOption): Promise<Suggest[]>

  fetchResult(text: string, option: SearchOption): Promise<SearchResult>
}
