import { useCallback } from 'react'
import { debounce, DebouncedFunc } from 'lodash'

export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): DebouncedFunc<T> {
  return useCallback(debounce(callback, delay), [delay])
}
