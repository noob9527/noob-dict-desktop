export interface DataWrapper<T> {
  id: number,
  editing: boolean,
  typing: boolean,
  dirty: boolean,
  syncing: boolean,
  showSpinner: boolean,
  oldData: T,
  newData: T,
}
