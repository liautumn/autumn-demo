import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ManifestoSection from '../ManifestoSection.vue'

describe('ManifestoSection', () => {
  const wrapper = mount(ManifestoSection)

  it('renders label 01 and the statement', () => {
    expect(wrapper.text()).toContain('01 / 关于')
    expect(wrapper.text()).toContain('少，不是更少。是刚刚好。')
  })

  it('renders the English closing line', () => {
    expect(wrapper.text()).toContain('We remove until only the essential remains')
  })

  it('exposes a single accessible copy of the statement', () => {
    const tokens = wrapper.findAll('[data-reveal-token]')
    expect(tokens).toHaveLength(3)
    for (const token of tokens) {
      expect(token.element.closest('[aria-hidden="true"]')).not.toBeNull()
    }
    expect(wrapper.find('p.sr-only').text()).toBe('少，不是更少。是刚刚好。')
  })
})
