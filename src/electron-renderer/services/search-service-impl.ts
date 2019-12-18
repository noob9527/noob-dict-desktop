import { SearchService } from '../../browser/services/search-service';
import { getSuggests, mockGetSuggests, mockSearch, search, SearchOption, SearchResult, Suggest } from 'noob-dict-core';
import { injectable } from 'inversify';

// this implementation only works if you can circumvent the CORS problem
@injectable()
export class CorsSearchService implements SearchService {
  fetchSuggests(text: string): Promise<Suggest[]> {
    return getSuggests(text);
  }

  fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
    return search(text, option);
  }
}

@injectable()
export class MockSearchService implements SearchService {
  fetchSuggests(text: string): Promise<Suggest[]> {
    return mockGetSuggests(text);
  }

  fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
    return mockSearch(text, option);
  }
}

