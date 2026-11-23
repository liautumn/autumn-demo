import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TextScrollReveal from '../text-scroll-reveal/TextScrollReveal.vue'

describe('TextScrollReveal', () => {
  it('renders one token per provided item', () => {
    const wrapper = mount(TextScrollReveal, {
      props: { text: '少，不是更少。', tokens: ['少，', '不是更少。'] },
    })
    expect(wrapper.findAll('[data-reveal-token]')).toHaveLength(2)
    expect(wrapper.text()).toContain('不是更少。')
  })
})
