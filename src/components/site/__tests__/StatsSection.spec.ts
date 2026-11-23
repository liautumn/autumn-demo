import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StatsSection from '../StatsSection.vue'

const NumberTickerStub = defineComponent({
  name: 'NumberTicker',
  props: { value: Number, duration: Number, decimalPlaces: Number },
  template: '<span class="ticker">{{ value }}</span>',
})

describe('StatsSection', () => {
  const wrapper = mount(StatsSection, { global: { stubs: { NumberTicker: NumberTickerStub } } })

  it('renders four stats in order', () => {
    expect(wrapper.findAll('.ticker').map((node) => node.text())).toEqual(['48', '12', '7', '9'])
    expect(wrapper.text()).toContain('交付项目')
    expect(wrapper.text()).toContain('国家与地区')
  })
})
