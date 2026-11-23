import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShimmerButton from '../shimmer-button/ShimmerButton.vue'

describe('ShimmerButton', () => {
  it('renders an anchor when href is provided', () => {
    const wrapper = mount(ShimmerButton, {
      props: { href: '#work' },
      slots: { default: '查看作品' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('#work')
    expect(wrapper.text()).toBe('查看作品')
  })

  it('renders a button otherwise', () => {
    const wrapper = mount(ShimmerButton, { slots: { default: '开始' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
  })
})
