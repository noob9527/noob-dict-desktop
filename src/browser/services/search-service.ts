import { SearchOption, SearchResult, Suggest } from 'noob-dict-core';

export const searchServiceToken = Symbol.for('search-service');

export interface SearchService {
  fetchSuggests(text: string): Promise<Suggest[]>

  fetchResult(text: string, option: SearchOption): Promise<SearchResult>
}
