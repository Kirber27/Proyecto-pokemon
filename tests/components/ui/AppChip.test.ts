import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppChip from '@/components/ui/AppChip.vue'

describe('AppChip', () => {
  it('renders the slot content', () => {
    const wrapper = mount(AppChip, { slots: { default: 'Fuego' } })

    expect(wrapper.text()).toBe('Fuego')
  })

  it('toggles the selected class from the prop', async () => {
    const wrapper = mount(AppChip, { props: { selected: false } })

    expect(wrapper.classes()).not.toContain('app-chip--selected')

    await wrapper.setProps({ selected: true })

    expect(wrapper.classes()).toContain('app-chip--selected')
  })
})
