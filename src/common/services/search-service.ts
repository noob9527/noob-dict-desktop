import { SearchOption, SearchResult, Suggest } from '@noob9527/noob-dict-core';

export const SearchServiceToken = Symbol.for('search-service');

export interface SearchService {
  fetchSuggests(text: string, user_id: string): Promise<Suggest[]>

  fetchResult(text: string, option: SearchOption): Promise<SearchResult>
}
