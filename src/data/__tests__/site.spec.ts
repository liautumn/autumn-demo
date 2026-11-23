import { describe, expect, it } from 'vitest'
import { capabilities, clients, navLinks, sectionLabels, stats, works } from '../site'

describe('site data', () => {
  it('has 5 unique works in narrative order', () => {
    expect(works.map((work) => work.index)).toEqual(['01', '02', '03', '04', '05'])
    expect(new Set(works.map((work) => work.id)).size).toBe(5)
  })

  it('uses the agreed navigation targets', () => {
    expect(navLinks.map((link) => link.href)).toEqual(['#work', '#about', '#contact'])
  })

  it('has 4 capabilities and 4 stats', () => {
    expect(capabilities).toHaveLength(4)
    expect(stats.map((stat) => stat.value)).toEqual([48, 12, 7, 9])
  })

  it('keeps section numbering 01-05', () => {
    expect(Object.values(sectionLabels).map((label) => label.index)).toEqual(['01', '02', '03', '04', '05'])
  })

  it('keeps clients fictional and non-empty', () => {
    expect(clients.length).toBeGreaterThan(3)
  })
})
