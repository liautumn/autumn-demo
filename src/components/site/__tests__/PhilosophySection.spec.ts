import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PhilosophySection from '../PhilosophySection.vue'

describe('PhilosophySection', () => {
  const wrapper = mount(PhilosophySection)

  it('renders label 04, the marquee phrase and the note', () => {
    expect(wrapper.text()).toContain('04 / 理念')
    expect(wrapper.text()).toContain('FORM FOLLOWS FEELING')
    expect(wrapper.text()).toContain('如果一件作品需要解释')
  })
})
