import { SearchService } from '../../common/services/search-service';
import { SearchOption, SearchResult, Suggest } from '@noob9527/noob-dict-core';
import { injectable } from 'inversify';
import { NoteService, NoteServiceToken } from '../../common/services/db/note-service';
import { rendererContainer } from '../../common/container/renderer-container';
import { NetworkSearchEngine, NetworkSuggestEngine } from '@noob9527/noob-dict-net-engines';

// this implementation only works if you can circumvent the CORS problem
@injectable()
export class CorsSearchService implements SearchService {
  private noteService: NoteService;

  constructor() {
    this.noteService = rendererContainer.get<NoteService>(NoteServiceToken);
  }

  async fetchSuggests(text: string): Promise<Suggest[]> {
    return NetworkSuggestEngine.getSuggests(text);
  }

  async fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
    return NetworkSearchEngine.search(text, option);
  }
}

@injectable()
export class MockSearchService implements SearchService {
  fetchSuggests(text: string): Promise<Suggest[]> {
    return NetworkSuggestEngine.getSuggests(text, { mock: true });
  }

  async fetchResult(text: string, option: SearchOption): Promise<SearchResult> {
    return NetworkSearchEngine.search(text, { mock: true });
  }
}

