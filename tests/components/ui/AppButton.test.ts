import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '@/components/ui/AppButton.vue'

describe('AppButton', () => {
  it('renders the slot content', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Aplicar' } })

    expect(wrapper.text()).toBe('Aplicar')
  })

  it('defaults to the primary variant and button type', () => {
    const wrapper = mount(AppButton)

    expect(wrapper.classes()).toContain('app-button--primary')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('applies the disabled attribute', () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emits a native click event', async () => {
    const wrapper = mount(AppButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
