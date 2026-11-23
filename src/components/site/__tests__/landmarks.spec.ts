import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HomeView from '@/views/HomeView.vue'

const RevealStub = { name: 'Reveal', template: '<div><slot /></div>' }
const SlotStub = { template: '<div><slot /></div>' }

const stubs = {
  Reveal: RevealStub,
  InteractiveGridPattern: true,
  TextScrollReveal: true,
  GlowingEffect: true,
  NumberTicker: true,
  HyperText: true,
  SpinningText: true,
  Marquee: SlotStub,
}

describe('section landmarks', () => {
  const wrapper = mount(HomeView, { global: { stubs } })

  const labelled = [
    ['#hero', 'hero-title'],
    ['#about', 'about-title'],
    ['#work', 'work-title'],
    ['#capabilities', 'capabilities-title'],
    ['#stats', 'stats-title'],
    ['#philosophy', 'philosophy-title'],
    ['#contact', 'contact-title'],
  ] as const

  it.each(labelled)('names %s with its heading', (sectionSelector, id) => {
    const section = wrapper.find(sectionSelector)
    expect(section.exists()).toBe(true)
    expect(section.attributes('aria-labelledby')).toBe(id)
    expect(wrapper.find(`#${id}`).exists()).toBe(true)
  })

  it('keeps the clients strip named', () => {
    expect(wrapper.find('section[aria-label="合作客户"]').exists()).toBe(true)
  })
})
