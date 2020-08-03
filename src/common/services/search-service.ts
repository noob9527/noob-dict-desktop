import { SearchOption, SearchResult, Suggest } from '@noob9527/noob-dict-core';

export const SearchServiceToken = Symbol.for('search-service');

export interface SearchService {
  fetchSuggests(text: string): Promise<Suggest[]>

  fetchResult(text: string, option: SearchOption): Promise<SearchResult>
}
