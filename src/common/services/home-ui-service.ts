export const SearchUiServiceToken = Symbol.for('search-ui-service')

export interface HomeUiService {
  toggle()

  show()

  hide()

  top()

  search(option: { text: string })

  // return if current state is pinned
  togglePin(): Promise<boolean>
}
