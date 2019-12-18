export const SearchUiServiceToken = Symbol.for('search-ui-service');

export interface SearchUiService {
  // return if current state is pinned
  togglePin(): Promise<boolean>
}
