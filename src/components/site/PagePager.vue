<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import {
  buildPageStops,
  findNextStop,
  isSpringSettled,
  resolvePageAnchor,
  stepSpring,
  type PageAnchor,
} from '@/lib/pageStops'

const WHEEL_THRESHOLD = 18
// A single mouse-wheel notch vs. a small continuous trackpad tick.
const WHEEL_IMPULSE = 32
const WHEEL_REARM_MS = 100
const WHEEL_SLOW_REARM_MS = 240
const TOUCH_THRESHOLD = 42
const TOUCH_TIMEOUT_MS = 900
const SPRING_MAX_FRAME = 0.05
const SPRING_TIMEOUT_MS = 1800

const reduced = usePreferredReducedMotion()
const enabled = computed(() => reduced.value !== 'reduce')

const stops: number[] = []
let mounted = false
let animating = false
let frame = 0
let position = 0
let velocity = 0
let target = 0
let targetLimit = 0
let startedAt = 0
let lastFrameAt = 0
let refreshFrame = 0
let bodyObserver: ResizeObserver | null = null

let lastWheelAt = Number.NEGATIVE_INFINITY
let lastWheelDirection: 1 | -1 = 1
let wheelAccumulator = 0
let wheelConsumed = false

let touchStart: { x: number; y: number; at: number } | null = null

let previousScrollBehavior: string | null = null

function maxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

function collectAnchors(): PageAnchor[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-page-anchor]'),
  ).map((element) => {
    const bounds = element.getBoundingClientRect()
    const offset = window.scrollY

    return {
      top: bounds.top + offset,
      bottom: bounds.bottom + offset,
      align: element.dataset.pageAlign === 'end' ? 'end' : 'start',
      offset: Number(element.dataset.pageOffset ?? 0) || 0,
    }
  })
}

function refreshStops() {
  const anchors = collectAnchors()
  stops.splice(
    0,
    stops.length,
    ...buildPageStops(anchors, window.innerHeight, maxScroll()),
  )
}

function scheduleStopRefresh() {
  if (!mounted || refreshFrame) return

  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0
    refreshStops()
  })
}

function forceScrollBehavior() {
  const html = document.documentElement
  if (previousScrollBehavior === null) {
    previousScrollBehavior = html.style.scrollBehavior
  }
  html.style.scrollBehavior = 'auto'
}

function restoreScrollBehavior() {
  if (previousScrollBehavior === null) return
  document.documentElement.style.scrollBehavior = previousScrollBehavior
  previousScrollBehavior = null
}

function cancelAnimation() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  animating = false
  restoreScrollBehavior()
}

function tick(now: number) {
  frame = 0

  const dt = Math.min(
    Math.max((now - lastFrameAt) / 1000, 0),
    SPRING_MAX_FRAME,
  )
  lastFrameAt = now

  const next = stepSpring(position, velocity, target, dt)
  position = next.position
  velocity = next.velocity

  if (position < 0) {
    position = 0
    velocity = 0
  } else if (position > targetLimit) {
    position = targetLimit
    velocity = 0
  }

  window.scrollTo(0, position)

  if (
    isSpringSettled(position, velocity, target) ||
    now - startedAt > SPRING_TIMEOUT_MS
  ) {
    window.scrollTo(0, target)
    animating = false
    restoreScrollBehavior()
    return
  }

  frame = requestAnimationFrame(tick)
}

function animateTo(nextTarget: number) {
  const limit = maxScroll()
  const destination = Math.min(Math.max(nextTarget, 0), limit)

  if (!enabled.value) {
    cancelAnimation()
    window.scrollTo(0, destination)
    return
  }

  const wasAnimating = animating
  const retainedVelocity = velocity
  const currentPosition = window.scrollY

  cancelAnimation()

  if (Math.abs(destination - currentPosition) < 1) return

  forceScrollBehavior()

  target = destination
  targetLimit = limit
  position = currentPosition
  velocity = wasAnimating ? retainedVelocity : 0
  startedAt = performance.now()
  lastFrameAt = startedAt
  animating = true

  frame = requestAnimationFrame(tick)
}

function stepPage(direction: 1 | -1): boolean {
  if (!enabled.value) return false

  const origin = animating ? target : window.scrollY
  const next = findNextStop(stops, origin, direction)
  if (next === null) return false

  animateTo(next)
  return true
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(
      'input, textarea, select, [contenteditable="true"], [contenteditable=""]',
    ) !== null
  )
}

function isInteractive(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(
      'a, button, input, textarea, select, [contenteditable="true"], [role="button"]',
    ) !== null
  )
}

function onWheel(event: WheelEvent) {
  if (!enabled.value) return
  if (event.ctrlKey || event.metaKey) return
  if (event.deltaY === 0) return
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

  const origin = event.target instanceof Element ? event.target : null
  if (origin?.closest('[data-native-scroll]')) return

  event.preventDefault()

  const now = performance.now()
  const gap = now - lastWheelAt
  lastWheelAt = now

  const unit =
    event.deltaMode === 1
      ? 16
      : event.deltaMode === 2
        ? window.innerHeight
        : 1
  const delta = event.deltaY * unit
  const direction: 1 | -1 = delta > 0 ? 1 : -1
  const isImpulse = Math.abs(delta) >= WHEEL_IMPULSE

  // A deliberate new notch may chain quickly; small tail events need a longer
  // silence before they can start another page.
  if (gap > (isImpulse ? WHEEL_REARM_MS : WHEEL_SLOW_REARM_MS)) {
    wheelConsumed = false
  }

  // Reversing direction mid-gesture should respond immediately.
  if (wheelConsumed && direction !== lastWheelDirection && isImpulse) {
    wheelConsumed = false
  }

  if (wheelAccumulator !== 0 && direction !== Math.sign(wheelAccumulator)) {
    wheelAccumulator = 0
  }

  if (wheelConsumed) return

  wheelAccumulator += delta
  if (Math.abs(wheelAccumulator) < WHEEL_THRESHOLD) return

  wheelAccumulator = 0
  if (!stepPage(direction)) return

  wheelConsumed = true
  lastWheelDirection = direction
}

function onKeyDown(event: KeyboardEvent) {
  if (!enabled.value || event.defaultPrevented) return
  if (event.metaKey || event.ctrlKey || event.altKey) return
  if (isEditable(event.target)) return

  let direction: 1 | -1 | null = null
  let edge: 'start' | 'end' | null = null

  switch (event.key) {
    case 'PageDown':
      direction = 1
      break
    case 'PageUp':
      direction = -1
      break
    case 'ArrowDown':
      direction = 1
      break
    case 'ArrowUp':
      direction = -1
      break
    case ' ':
    case 'Spacebar':
      if (isInteractive(event.target)) return
      direction = event.shiftKey ? -1 : 1
      break
    case 'Home':
      edge = 'start'
      break
    case 'End':
      edge = 'end'
      break
    default:
      return
  }

  event.preventDefault()
  if (event.repeat) return

  if (edge === 'start') {
    animateTo(stops[0] ?? 0)
    return
  }

  if (edge === 'end') {
    animateTo(stops[stops.length - 1] ?? maxScroll())
    return
  }

  if (direction) stepPage(direction)
}

function onTouchStart(event: TouchEvent) {
  if (!enabled.value || event.touches.length !== 1) {
    touchStart = null
    return
  }

  const touch = event.touches[0]
  if (!touch) return

  touchStart = { x: touch.clientX, y: touch.clientY, at: performance.now() }
}

function onTouchMove(event: TouchEvent) {
  if (!enabled.value || !touchStart) return

  if (event.touches.length !== 1) {
    touchStart = null
    return
  }

  const touch = event.touches[0]
  if (!touch) return

  const dx = touch.clientX - touchStart.x
  const dy = touch.clientY - touchStart.y

  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
    event.preventDefault()
  }
}

function onTouchEnd(event: TouchEvent) {
  if (!enabled.value || !touchStart || event.touches.length > 0) {
    touchStart = null
    return
  }

  const start = touchStart
  touchStart = null

  if (event.changedTouches.length !== 1) return

  const touch = event.changedTouches[0]
  if (!touch) return

  const dx = touch.clientX - start.x
  const dy = touch.clientY - start.y

  if (performance.now() - start.at > TOUCH_TIMEOUT_MS) return
  if (Math.abs(dy) < TOUCH_THRESHOLD || Math.abs(dy) <= Math.abs(dx)) return

  stepPage(dy < 0 ? 1 : -1)
}

function anchorDestination(hash: string): HTMLElement | null {
  const id = hash.slice(1)

  try {
    return document.getElementById(decodeURIComponent(id))
  } catch {
    return document.getElementById(id)
  }
}

function onDocumentClick(event: MouseEvent) {
  if (!enabled.value) return
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  const link =
    event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>('a[href]')
      : null
  if (!link) return

  const href = link.getAttribute('href')
  if (!href || !href.startsWith('#') || href === '#' || href === '#main') return

  const destination = anchorDestination(href)
  if (!destination) return

  event.preventDefault()

  const bounds = destination.getBoundingClientRect()
  const offset = window.scrollY

  const pageTarget = resolvePageAnchor(
    {
      top: bounds.top + offset,
      bottom: bounds.bottom + offset,
      align: destination.dataset.pageAlign === 'end' ? 'end' : 'start',
      offset: Number(destination.dataset.pageOffset ?? 0) || 0,
    },
    window.innerHeight,
  )

  try {
    history.pushState(null, '', href)
  } catch {
    location.hash = href
  }

  animateTo(pageTarget)
}

watch(enabled, (value) => {
  if (!mounted) return

  document.documentElement.classList.toggle('page-pager-active', value)

  if (!value) {
    const wasAnimating = animating
    const destination = target
    cancelAnimation()
    if (wasAnimating) window.scrollTo(0, destination)
    return
  }

  refreshStops()
})

onMounted(() => {
  mounted = true
  refreshStops()

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('resize', scheduleStopRefresh)
  document.addEventListener('click', onDocumentClick)

  document.documentElement.classList.toggle('page-pager-active', enabled.value)

  if (typeof ResizeObserver !== 'undefined') {
    bodyObserver = new ResizeObserver(scheduleStopRefresh)
    bodyObserver.observe(document.body)
  }

  document.fonts?.ready.then(scheduleStopRefresh, () => {})
})

onBeforeUnmount(() => {
  mounted = false

  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('resize', scheduleStopRefresh)
  document.removeEventListener('click', onDocumentClick)

  if (refreshFrame) cancelAnimationFrame(refreshFrame)
  refreshFrame = 0

  bodyObserver?.disconnect()
  bodyObserver = null

  cancelAnimation()
  document.documentElement.classList.remove('page-pager-active')
})
</script>

<template>
  <span hidden data-page-pager aria-hidden="true" />
</template>
