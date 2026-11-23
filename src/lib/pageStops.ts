export interface PageAnchor {
  top: number
  bottom: number
  align?: 'start' | 'end'
  offset?: number
}

export interface PageStopOptions {
  maxStep?: number
  minTail?: number
}

export interface SpringConfig {
  stiffness: number
  damping: number
}

export interface SpringState {
  position: number
  velocity: number
}

export const PAGE_SPRING: SpringConfig = { stiffness: 175, damping: 18 }

const DEDUPE_PX = 2

/**
 * Resolve the scroll position that presents an anchor as a full page.
 * Start-aligned anchors sit `offset` below the viewport top; end-aligned
 * anchors sit `offset` above the viewport bottom.
 */
export function resolvePageAnchor(anchor: PageAnchor, viewport: number): number {
  const offset = anchor.offset ?? 0
  const target =
    anchor.align === 'end' ? anchor.bottom + offset - viewport : anchor.top - offset

  return Math.round(target)
}

/**
 * Build the ordered stops for a paged document. Curated anchors keep their
 * alignment; gaps larger than one comfortable page receive viewport-sized
 * stops, avoiding a sliver at the end of the gap.
 */
export function buildPageStops(
  anchors: readonly PageAnchor[],
  viewport: number,
  maxScroll: number,
  options: PageStopOptions = {},
): number[] {
  const vh = Math.max(1, viewport)
  const max = Math.max(0, Math.round(maxScroll))
  const maxStep = Math.max(1, options.maxStep ?? vh * 1.4)
  const minTail = Math.max(0, options.minTail ?? vh * 0.35)

  const raw = [0, max, ...anchors.map((anchor) => resolvePageAnchor(anchor, vh))]
  raw.sort((a, b) => a - b)

  const unique: number[] = []
  for (const rawValue of raw) {
    const value = Math.max(0, Math.min(max, rawValue))
    const last = unique[unique.length - 1]

    if (last === undefined || value - last > DEDUPE_PX) {
      unique.push(value)
    } else if (value === max) {
      unique[unique.length - 1] = max
    }
  }

  const stops: number[] = []
  for (const value of unique) {
    const previous = stops[stops.length - 1]

    if (previous !== undefined && value - previous > maxStep) {
      let candidate = previous + vh
      while (value - candidate >= minTail) {
        stops.push(Math.round(candidate))
        candidate += vh
      }
    }

    stops.push(value)
  }

  return stops
}

/**
 * Return the next stop strictly beyond `current` in the given direction.
 * A one-pixel tolerance absorbs fractional scroll positions.
 */
export function findNextStop(
  stops: readonly number[],
  current: number,
  direction: 1 | -1,
): number | null {
  if (direction > 0) {
    for (const stop of stops) {
      if (stop > current + 1) return stop
    }
    return null
  }

  for (let index = stops.length - 1; index >= 0; index -= 1) {
    const stop = stops[index]
    if (stop !== undefined && stop < current - 1) return stop
  }

  return null
}

/** Advance a damped spring by one frame using semi-implicit Euler. */
export function stepSpring(
  position: number,
  velocity: number,
  target: number,
  dt: number,
  config: SpringConfig = PAGE_SPRING,
): SpringState {
  const acceleration =
    -config.stiffness * (position - target) - config.damping * velocity
  const nextVelocity = velocity + acceleration * dt

  return {
    position: position + nextVelocity * dt,
    velocity: nextVelocity,
  }
}

export function isSpringSettled(
  position: number,
  velocity: number,
  target: number,
  distanceThreshold = 0.4,
  speedThreshold = 2,
): boolean {
  return (
    Math.abs(position - target) < distanceThreshold &&
    Math.abs(velocity) < speedThreshold
  )
}
