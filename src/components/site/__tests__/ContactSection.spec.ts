import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContactSection from '../ContactSection.vue'

const HyperTextStub = defineComponent({
  name: 'HyperText',
  props: { text: String },
  template: '<span>{{ text }}</span>',
})

const SpinningTextStub = defineComponent({
  name: 'SpinningText',
  props: { text: String },
  template: '<div data-spinning-badge />',
})

const LiquidTypeStub = defineComponent({
  name: 'LiquidType',
  template: '<div data-liquid-type><slot /></div>',
})

describe('ContactSection', () => {
  const wrapper = mount(ContactSection, {
    global: {
      stubs: {
        HyperText: HyperTextStub,
        SpinningText: SpinningTextStub,
        LiquidType: LiquidTypeStub,
      },
    },
  })

  it('renders label 05, mail links and availability', () => {
    expect(wrapper.text()).toContain('05 / 联系')
    expect(wrapper.find('a[href="mailto:hello@monolith.studio"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('2027 年档期开放')
    expect(wrapper.find('[data-spinning-badge]').exists()).toBe(true)
  })

  it('wraps the closing statement in the liquid type surface', () => {
    const surface = wrapper.find('[data-liquid-type]')
    expect(surface.exists()).toBe(true)
    expect(surface.text()).toContain('LET\'S MAKE')
    expect(surface.text()).toContain('quiet.')
  })
})
