import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SiteNav from '../SiteNav.vue'

describe('SiteNav', () => {
  const wrapper = mount(SiteNav)

  it('renders anchor navigation', () => {
    expect(wrapper.find('nav[aria-label="主导航"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#work"]').text()).toBe('作品')
    expect(wrapper.find('a[href="#about"]').text()).toBe('关于')
    expect(wrapper.find('a[href="#contact"]').text()).toBe('联系')
  })

  it('renders a Shanghai clock and mail CTA', () => {
    expect(wrapper.text()).toMatch(/SHANGHAI \d{2}:\d{2}/)
    expect(wrapper.find('a[href="mailto:hello@monolith.studio"]').exists()).toBe(true)
  })
})
