export const SearchUiServiceToken = Symbol.for('search-ui-service');

export interface SearchUiService {
  showSearchWindow(): Promise<void>
  // return if current state is pinned
  togglePin(): Promise<boolean>
}
