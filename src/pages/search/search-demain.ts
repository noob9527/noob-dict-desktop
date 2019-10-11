import { Model } from "dva";
import { EngineIdentifier, SearchResult, Suggest } from "noob-dict-core";

export type SearchResults = { [index in EngineIdentifier]?: Maybe<SearchResult> };

export interface SearchState {
  text: string,
  suggests: Suggest[],
  engines: EngineIdentifier[],
  searchResults: SearchResults,
}

export interface SearchModel extends Model {
  state: SearchState
}