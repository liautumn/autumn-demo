import { describe, expect, it } from 'vitest'
import { formatShanghaiTime } from '../time'

describe('formatShanghaiTime', () => {
  it('formats UTC as Shanghai HH:mm', () => {
    expect(formatShanghaiTime(new Date('2026-11-23T06:32:00Z'))).toBe('14:32')
  })
})
