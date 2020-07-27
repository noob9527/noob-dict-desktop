export const SearchUiServiceToken = Symbol.for('search-ui-service');

export interface SearchUiService {
  toggleSearchWindow(option: { isSettingWindowOpen }): Promise<void>

  showSearchWindow(option: { isSettingWindowOpen })

  hideSearchWindow(option: { isSettingWindowOpen })

  topSearchWindow(option: { isSettingWindowOpen })

  search(option: { text: string })

  // return if current state is pinned
  togglePin(): Promise<boolean>
}
