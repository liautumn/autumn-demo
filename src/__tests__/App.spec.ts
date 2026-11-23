import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../App.vue'

describe('App shell', () => {
  const wrapper = mount(App, {
    global: { stubs: { RouterView: true, SiteNav: true, SiteFooter: true } },
  })

  it('exposes a skip link and decorative grain', () => {
    expect(wrapper.find('a[href="#main"]').exists()).toBe(true)
    expect(wrapper.find('[aria-hidden="true"].noise-overlay').exists()).toBe(true)
  })
})
