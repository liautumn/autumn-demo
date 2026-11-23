import { describe, expect, it } from 'vitest'
import {
  buildPageStops,
  findNextStop,
  isSpringSettled,
  resolvePageAnchor,
  stepSpring,
} from '../pageStops'

describe('resolvePageAnchor', () => {
  it('leaves a start-aligned anchor below the header offset', () => {
    expect(resolvePageAnchor({ top: 500, bottom: 900, offset: 88 }, 900)).toBe(412)
  })

  it('leaves an end-aligned anchor above the viewport bottom', () => {
    expect(
      resolvePageAnchor({ top: 1200, bottom: 1600, align: 'end', offset: 24 }, 900),
    ).toBe(724)
  })
})

describe('buildPageStops', () => {
  it('keeps the document edges and aligns the curated anchors', () => {
    const anchors = [
      { top: 0, bottom: 1003 },
      { top: 1003, bottom: 2729 },
      { top: 2423, bottom: 2728, align: 'end' as const, offset: 24 },
      { top: 2729, bottom: 5832 },
      { top: 4159, bottom: 4855, offset: 88 },
      { top: 4918, bottom: 5658, offset: 88 },
      { top: 5832, bottom: 5929, offset: 88 },
      { top: 6919, bottom: 7350 },
      { top: 7350, bottom: 8020 },
      { top: 8020, bottom: 9010 },
      { top: 9010, bottom: 9768, align: 'end' as const },
    ]

    expect(buildPageStops(anchors, 900, 8868)).toEqual([
      0, 1003, 1852, 2729, 3629, 4071, 4830, 5744, 6919, 7350, 8020, 8868,
    ])
  })

  it('fills a large gap with viewport-sized pages and avoids a tiny tail', () => {
    expect(
      buildPageStops(
        [
          { top: 0, bottom: 0 },
          { top: 3000, bottom: 3000 },
        ],
        1000,
        3000,
      ),
    ).toEqual([0, 1000, 2000, 3000])

    expect(
      buildPageStops(
        [
          { top: 0, bottom: 0 },
          { top: 2500, bottom: 2500 },
        ],
        1000,
        2500,
      ),
    ).toEqual([0, 1000, 2000, 2500])
  })

  it('clamps anchors to the scrollable range and removes duplicates', () => {
    expect(
      buildPageStops(
        [
          { top: -100, bottom: 100 },
          { top: 5000, bottom: 5000 },
        ],
        1000,
        2000,
        { maxStep: 5000 },
      ),
    ).toEqual([0, 2000])
  })
})

describe('findNextStop', () => {
  const stops = [0, 900, 1800, 2700]

  it('moves one page at a time in both directions', () => {
    expect(findNextStop(stops, 0, 1)).toBe(900)
    expect(findNextStop(stops, 900, 1)).toBe(1800)
    expect(findNextStop(stops, 1800, -1)).toBe(900)
    expect(findNextStop(stops, 2700, -1)).toBe(1800)
  })

  it('returns null at the ends of the document', () => {
    expect(findNextStop(stops, 2700, 1)).toBeNull()
    expect(findNextStop(stops, 0, -1)).toBeNull()
  })

  it('finds the next stop when starting from an intermediate scroll position', () => {
    expect(findNextStop(stops, 950, 1)).toBe(1800)
    expect(findNextStop(stops, 950, -1)).toBe(900)
  })
})

describe('stepSpring', () => {
  it('overshoots the target slightly before settling', () => {
    let position = 0
    let velocity = 0
    let peak = 0

    for (let frame = 0; frame < 120; frame += 1) {
      const next = stepSpring(position, velocity, 900, 1 / 60)
      position = next.position
      velocity = next.velocity
      peak = Math.max(peak, position)
    }

    expect(peak).toBeGreaterThan(900 + 10)
    expect(peak).toBeLessThan(900 + 60)
    expect(Math.abs(position - 900)).toBeLessThan(1)
    expect(isSpringSettled(position, velocity, 900)).toBe(true)
  })
})
