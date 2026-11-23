import { describe, expect, it } from 'vitest'
import { splitRevealTokens } from '../text'

describe('splitRevealTokens', () => {
  it('splits Latin text on whitespace', () => {
    expect(splitRevealTokens('We remove  until only')).toEqual(['We', 'remove', 'until', 'only'])
  })

  it('splits CJK text per character and keeps punctuation attached', () => {
    expect(splitRevealTokens('少，不是更少。')).toEqual(['少，', '不', '是', '更', '少。'])
  })

  it('prefers explicit tokens', () => {
    expect(splitRevealTokens('少，不是更少。', ['少，', '不是更少。'])).toEqual(['少，', '不是更少。'])
  })
})
