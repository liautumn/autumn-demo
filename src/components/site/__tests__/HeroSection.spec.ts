import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import HeroSection from '../HeroSection.vue'

const RevealStub = { name: 'Reveal', template: '<div><slot /></div>' }
const LiquidTypeStub = defineComponent({
  name: 'LiquidType',
  props: { id: String, reveal: Boolean },
  template: '<div :id="id" data-liquid-type><slot /></div>',
})

describe('HeroSection', () => {
  const wrapper = mount(HeroSection, {
    global: {
      stubs: { Reveal: RevealStub, InteractiveGridPattern: true, LiquidType: LiquidTypeStub },
    },
  })

  it('wraps the headline in the liquid surface', () => {
    const liquid = wrapper.find('[data-liquid-type]')
    expect(liquid.exists()).toBe(true)
    expect(liquid.attributes('id')).toBe('hero-title')
    expect(liquid.find('h1').exists()).toBe(true)
    expect(liquid.find('h1').attributes('id')).toBeUndefined()
    expect(wrapper.findComponent(LiquidTypeStub).props('reveal')).toBe(true)
  })

  it('renders the headline and Chinese subtitle', () => {
    const text = wrapper.text()
    expect(text).toContain('WE SHAPE')
    expect(text).toContain('quiet,')
    expect(text).toContain('DELIBERATE')
    expect(text).toContain('digital.')
    expect(text).toContain('独石是一间独立设计工作室')
  })

  it('links the primary actions', () => {
    expect(wrapper.find('a[href="#work"]').text()).toContain('查看作品')
    expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(true)
  })
})
