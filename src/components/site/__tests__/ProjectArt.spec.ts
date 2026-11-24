import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProjectArt from '../ProjectArt.vue'

const variants = ['blank', 'north34', 'handle', 'slowpress', 'atlas'] as const

describe('ProjectArt', () => {
  it.each(variants)('renders an accessible %s composition without images', (variant) => {
    const wrapper = mount(ProjectArt, { props: { variant, label: '项目封面' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('项目封面')
    expect(wrapper.find(`[data-art="${variant}"]`).exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it.each(variants)('shows the whole %s artwork in both orientations', (variant) => {
    const wrapper = mount(ProjectArt, { props: { variant, label: '项目封面' } })
    const portrait = wrapper.find('svg[data-orientation="portrait"]')
    const wide = wrapper.find('svg[data-orientation="wide"]')

    expect(portrait.exists()).toBe(true)
    expect(portrait.attributes('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(portrait.find(`[data-art="${variant}"]`).exists()).toBe(true)

    expect(wide.exists()).toBe(true)
    expect(wide.attributes('viewBox')).toBe('0 0 1600 760')
    expect(wide.attributes('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(wide.find(`[data-art="${variant}"]`).exists()).toBe(true)
  })
})
