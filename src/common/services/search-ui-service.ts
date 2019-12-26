export const SearchUiServiceToken = Symbol.for('search-ui-service');

export interface SearchUiService {
  toggleSearchWindow(option: { isSettingWindowOpen }): Promise<void>

  showSearchWindow()

  // return if current state is pinned
  togglePin(): Promise<boolean>
}
