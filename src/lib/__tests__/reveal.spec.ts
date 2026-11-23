import { describe, expect, it } from 'vitest'
import { revealProgress } from '../reveal'

describe('revealProgress', () => {
  it('stays at zero before the container reaches the viewport top', () => {
    expect(revealProgress(200, 1400, 700)).toBe(0)
  })

  it('normalizes over pinned travel, not viewport height', () => {
    expect(revealProgress(-350, 1400, 700)).toBe(0.5)
  })

  it('reaches full opacity while the sticky block is still pinned', () => {
    expect(revealProgress(-700, 1400, 700)).toBe(1)
    expect(revealProgress(-900, 1400, 700)).toBe(1)
  })

  it('handles degenerate geometry without dividing by zero', () => {
    expect(revealProgress(-10, 700, 700)).toBe(1)
    expect(revealProgress(10, 700, 700)).toBe(0)
  })
})
