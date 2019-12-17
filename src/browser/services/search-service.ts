import { SearchOption, SearchResult, Suggest } from "noob-dict-core";
import { container } from "tsyringe";

// work as injection token
export class SearchService {
  fetchSuggests(text: string): Promise<Suggest[]> {
    throw new Error();
  }

  fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
    throw new Error();
  }
}

export {
  fetchSuggests,
  fetchResult,
};

async function fetchSuggests(text: string): Promise<Suggest[]> {
  const searchService = container.resolve(SearchService);
  return searchService.fetchSuggests(text);
}

async function fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
  const searchService = container.resolve(SearchService);
  return searchService.fetchResult(text, option);
}

