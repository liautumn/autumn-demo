import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LiquidType from '../LiquidType.vue'

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})

describe('LiquidType', () => {
  it('renders plain content when HTML-in-canvas is unavailable', () => {
    const wrapper = mount(LiquidType, {
      slots: { default: '<p>液态文字</p>' },
    })

    expect(wrapper.find('[data-liquid-type="static"]').exists()).toBe(true)
    expect(wrapper.findAll('p')).toHaveLength(1)
    expect(wrapper.text()).toContain('液态文字')
  })
})
