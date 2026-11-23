import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SiteFooter from '../SiteFooter.vue'

describe('SiteFooter', () => {
  const wrapper = mount(SiteFooter)

  it('renders navigation, mail and back-to-top', () => {
    expect(wrapper.text()).toContain('© 2026 MONOLITH STUDIO')
    expect(wrapper.find('a[href="#hero"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#work"]').exists()).toBe(true)
    expect(wrapper.find('a[href="mailto:hello@monolith.studio"]').exists()).toBe(true)
  })
})
