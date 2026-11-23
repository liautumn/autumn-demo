import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CapabilitiesSection from '../CapabilitiesSection.vue'

describe('CapabilitiesSection', () => {
  const wrapper = mount(CapabilitiesSection)

  it('renders label 03 and four capabilities', () => {
    expect(wrapper.text()).toContain('03 / 能力')
    expect(wrapper.findAll('li')).toHaveLength(4)
    expect(wrapper.text()).toContain('品牌识别')
    expect(wrapper.text()).toContain('艺术指导')
  })
})
