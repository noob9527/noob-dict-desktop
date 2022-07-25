export const SearchUiServiceToken = Symbol.for('search-ui-service');

export interface SearchUiService {
  toggleSearchWindow(): Promise<void>

  showSearchWindow()

  hideSearchWindow()

  topSearchWindow()

  search(option: { text: string })

  // return if current state is pinned
  togglePin(): Promise<boolean>
}
