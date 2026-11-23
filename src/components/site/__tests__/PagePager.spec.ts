import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const motion = vi.hoisted(() => ({
  reduced: 'no-preference' as 'reduce' | 'no-preference',
}))

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  const { computed } = await import('vue')

  return {
    ...actual,
    usePreferredReducedMotion: () => computed(() => motion.reduced),
  }
})

import PagePager from '../PagePager.vue'

function rect(top: number, bottom: number): DOMRect {
  return {
    top,
    bottom,
    left: 0,
    right: 0,
    width: 0,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => ({}),
  }
}

let scrollToMock: ReturnType<typeof vi.fn>
let wrapper: ReturnType<typeof mount> | null = null

beforeEach(() => {
  motion.reduced = 'no-preference'

  document.body.innerHTML = `
    <section id="hero" data-page-anchor>hero</section>
    <section id="work" data-page-anchor>work</section>
    <a id="skip" href="#main">skip</a>
    <a id="to-work" href="#work">work</a>
  `
  document.querySelector('#hero')!.getBoundingClientRect = () => rect(0, 600)
  document.querySelector('#work')!.getBoundingClientRect = () => rect(600, 1200)

  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: 1800,
  })
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 0,
    writable: true,
  })

  scrollToMock = vi.fn()
  vi.stubGlobal('scrollTo', scrollToMock)
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.unstubAllGlobals()
  document.documentElement.classList.remove('page-pager-active')
  document.documentElement.style.scrollBehavior = ''
  document.body.innerHTML = ''
  history.replaceState(null, '', location.pathname)
})

async function mountPager() {
  wrapper = mount(PagePager)
  await nextTick()
  return wrapper
}

describe('PagePager', () => {
  it('marks the document as paged while motion is allowed', async () => {
    await mountPager()

    expect(document.documentElement.classList.contains('page-pager-active')).toBe(true)
  })

  it('leaves native scrolling alone when reduced motion is preferred', async () => {
    motion.reduced = 'reduce'
    await mountPager()

    expect(document.documentElement.classList.contains('page-pager-active')).toBe(false)

    const event = new WheelEvent('wheel', { deltaY: 120, cancelable: true })
    window.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
  })

  it('turns one wheel gesture into one page', async () => {
    await mountPager()

    const event = new WheelEvent('wheel', { deltaY: 120, cancelable: true })
    window.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    await vi.waitFor(
      () => {
        const lastCall = scrollToMock.mock.calls.at(-1)
        expect(lastCall?.[1]).toBeGreaterThan(598)
        expect(lastCall?.[1]).toBeLessThan(602)
      },
      { timeout: 2000, interval: 50 },
    )
  })

  it('chains a second wheel gesture during the spring into another page', async () => {
    await mountPager()

    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))
    await new Promise((resolve) => setTimeout(resolve, 120))
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))

    await vi.waitFor(
      () => {
        const lastCall = scrollToMock.mock.calls.at(-1)
        expect(lastCall?.[1]).toBeGreaterThan(1198)
        expect(lastCall?.[1]).toBeLessThan(1202)
      },
      { timeout: 2500, interval: 50 },
    )
  })

  it('routes in-page anchors through the pager but leaves the skip link alone', async () => {
    await mountPager()

    const skipEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    document.querySelector('#skip')!.dispatchEvent(skipEvent)

    expect(skipEvent.defaultPrevented).toBe(false)

    const workEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    document.querySelector('#to-work')!.dispatchEvent(workEvent)

    expect(workEvent.defaultPrevented).toBe(true)
    expect(location.hash).toBe('#work')
  })
})
