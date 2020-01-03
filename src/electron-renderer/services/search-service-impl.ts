import { SearchService } from '../../common/services/search-service';
import {
  getSuggests,
  mockGetSuggests,
  mockSearch,
  search,
  SearchJsonResult,
  SearchOption,
  Suggest,
} from 'noob-dict-core';
import { injectable } from 'inversify';

// this implementation only works if you can circumvent the CORS problem
@injectable()
export class CorsSearchService implements SearchService {
  fetchSuggests(text: string): Promise<Suggest[]> {
    return getSuggests(text);
  }

  async fetchResult(text: string, option: SearchOption): Promise<SearchJsonResult> {
    const result = await search(text, option);
    return result.toJSON();
  }
}

@injectable()
export class MockSearchService implements SearchService {
  fetchSuggests(text: string): Promise<Suggest[]> {
    return mockGetSuggests(text);
  }

  async fetchResult(text: string, option: SearchOption): Promise<SearchJsonResult> {
    const result = await mockSearch(text, option);
    return result.toJSON();
  }
}

