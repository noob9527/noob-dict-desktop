import { isEqual } from 'lodash'
import { LLMProviderSetting } from './user-profile'

describe('comparison', () => {
  it('case 1', () => {
    expect(isEqual(null, null)).toBe(true)
    expect(isEqual(null, undefined)).toBe(false)
    expect(isEqual({}, {})).toBe(true)
  })
  it('case 10', () => {
    const a: LLMProviderSetting = {
      open_ai: {
        base_url: 'a',
      },
      gemini: null,
    }
    const b: LLMProviderSetting = {
      open_ai: {
        base_url: 'b',
      },
      gemini: null,
    }
    expect(isEqual(a?.open_ai, b.open_ai)).toBe(false)
  })

  it('case 20', () => {
    const a = {
      llm: {
        open_ai: {
          base_url: 'a',
        },
        gemini: null,
      },
    }
    const b = {
      llm: {
        open_ai: {
          base_url: 'b',
        },
        gemini: null,
      },
    }
    const c = {
      llm: {
        open_ai: {
          base_url: 'a',
        },
        gemini: null,
      },
    }
    expect(isEqual(a, b)).toBe(false)
    expect(isEqual(a, c)).toBe(true)
  })
})
