import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/inspira/html-in-canvas', () => ({
  supportsHtmlInCanvas: () => true,
  HtmlInCanvas: { name: 'HtmlInCanvas', template: '<div data-html-in-canvas><slot /></div>' },
}))

import LiquidType from '../LiquidType.vue'

const HtmlLiquidStub = defineComponent({
  name: 'HtmlLiquid',
  template: '<div data-html-liquid><slot /></div>',
})

describe('LiquidType with native HTML-in-canvas', () => {
  it('renders a hidden measuring copy plus the liquid surface', () => {
    const wrapper = mount(LiquidType, {
      slots: { default: '<p>液态文字</p>' },
      global: { stubs: { HtmlLiquid: HtmlLiquidStub } },
    })

    const root = wrapper.find('[data-liquid-type]')
    expect(root.exists()).toBe(true)
    expect(root.attributes('data-liquid-type')).toBe('')
    expect(wrapper.findAll('p')).toHaveLength(2)
    expect(wrapper.find('[data-liquid-measure]').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('[data-html-liquid]').exists()).toBe(true)
    expect(wrapper.text()).toContain('液态文字')
  })

  it('forwards the landmark id and entrance class to the surface wrapper', () => {
    const wrapper = mount(LiquidType, {
      props: { id: 'hero-title', reveal: true },
      slots: { default: '<p>液态文字</p>' },
      global: { stubs: { HtmlLiquid: HtmlLiquidStub } },
    })

    const root = wrapper.find('[data-liquid-type]')
    expect(root.attributes('id')).toBe('hero-title')
    expect(root.classes()).toContain('liquid-enter')
  })
})
