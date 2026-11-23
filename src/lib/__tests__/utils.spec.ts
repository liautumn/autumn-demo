import { describe, expect, it } from 'vitest'
import { cn } from '../utils'

describe('cn', () => {
  it('lets later Tailwind utilities win', () => {
    const result = cn('h-[200vh] px-4', 'h-[140vh]')
    expect(result).toContain('h-[140vh]')
    expect(result).toContain('px-4')
    expect(result).not.toContain('h-[200vh]')
  })

  it('drops falsy values', () => {
    expect(cn('text-ink', false && 'hidden', null, undefined)).toBe('text-ink')
  })
})
