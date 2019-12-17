import { SearchService } from "../../browser/services/search-service";
import { getSuggests, mockGetSuggests, mockSearch, search, SearchOption, SearchResult, Suggest } from "noob-dict-core";
import { container } from "tsyringe";

// this implementation only works if you can circumvent the CORS problem
class CorsSearchService extends SearchService {
  fetchSuggests(text: string): Promise<Suggest[]> {
    return getSuggests(text);
  }

  fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
    return search(text, option);
  }
}

class MockSearchService extends SearchService {
  fetchSuggests(text: string): Promise<Suggest[]> {
    return mockGetSuggests(text);
  }

  fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
    return mockSearch(text, option);
  }
}

export default function registerSearchService() {
  container.register(SearchService, {
    useClass: MockSearchService
  });
}