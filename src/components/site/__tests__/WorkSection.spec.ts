import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WorkSection from '../WorkSection.vue'

describe('WorkSection', () => {
  const wrapper = mount(WorkSection, { global: { stubs: { GlowingEffect: true } } })

  it('renders five project cards in order', () => {
    const cards = wrapper.findAll('article')
    expect(cards).toHaveLength(5)
    expect(cards[0]?.text()).toContain('BLANK FURNITURE')
    expect(cards[4]?.text()).toContain('ATLAS')
  })

  it('renders placeholder links with accessible names', () => {
    const links = wrapper.findAll('a[href="#"]')
    expect(links).toHaveLength(5)
    for (const link of links) {
      expect(link.attributes('aria-label')).toBeTruthy()
    }
  })
})
