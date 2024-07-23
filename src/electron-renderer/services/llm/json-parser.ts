import { parse } from 'best-effort-json-parser'

export function getJsonObj(text: string): any {
  const regexp = /{[^{}]*}|{(?:[^{}]*|{[^{}]*})*}/
  const jsonLikeStr = regexp.exec(text)?.[0]
  return parse(jsonLikeStr)
}
