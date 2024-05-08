import { isEqual } from 'lodash'
import { LLMSetting } from './user-profile'

describe('comparison', () => {
  it('case 1', () => {
    expect(isEqual(null, null)).toBe(true)
    expect(isEqual(null, undefined)).toBe(false)
    expect(isEqual({}, {})).toBe(true)
  })
  it('case 40', () => {
    const a: LLMSetting = {
      open_ai: {
        base_url: 'a'
      },
      gemini: null,
    }
    const b: LLMSetting = {
      open_ai: {
        base_url: 'b'
      },
      gemini: null,
    }
    expect(isEqual(a?.open_ai, b.open_ai)).toBe(false)
  })
})
