import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ClientsMarquee from '../ClientsMarquee.vue'

describe('ClientsMarquee', () => {
  const wrapper = mount(ClientsMarquee)

  it('offers a screen-reader list and hides the repeated visuals', () => {
    expect(wrapper.find('section[aria-label="合作客户"]').exists()).toBe(true)
    expect(wrapper.find('[data-clients-sr]').text()).toContain('BLANK')
    expect(wrapper.find('[data-clients-marquee]').attributes('aria-hidden')).toBe('true')
  })
})
