import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCheckbox from '@/components/ui/AppCheckbox.vue'

describe('AppCheckbox', () => {
  it('reflects the v-model value', () => {
    const wrapper = mount(AppCheckbox, { props: { modelValue: true } })
    const input = wrapper.find('input[type="checkbox"]')

    expect((input.element as HTMLInputElement).checked).toBe(true)
  })

  it('emits update:modelValue when toggled', async () => {
    const wrapper = mount(AppCheckbox, { props: { modelValue: false } })

    await wrapper.find('input[type="checkbox"]').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('renders the slot as the label text', () => {
    const wrapper = mount(AppCheckbox, { slots: { default: 'Fuego' } })

    expect(wrapper.text()).toBe('Fuego')
  })
})
