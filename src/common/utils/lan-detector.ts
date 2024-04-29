import { franc } from 'franc-min'

const map = {
  eng: 'EN',
  cmn: 'ZH',
  jpn: 'JP',
  und: null,
}

export type Language = 'EN' | 'ZH' | 'JP'

/**
 * https://github.com/wooorm/franc
 * @param text
 */
export function detect(text: string): Language | null {
  const key = franc(text, {
    minLength: 1,
    only: ['cmn', 'eng', 'jpn'],
  })
  return map[key] ?? null
}
