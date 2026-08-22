import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PokeballSpinner from '@/components/ui/PokeballSpinner.vue'

describe('PokeballSpinner', () => {
  it('announces the loading state to assistive tech', () => {
    const wrapper = mount(PokeballSpinner)

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toBe('Cargando…')
  })

  it('applies the given size', () => {
    const wrapper = mount(PokeballSpinner, { props: { size: '64px' } })

    expect(wrapper.attributes('style')).toContain('width: 64px')
    expect(wrapper.attributes('style')).toContain('height: 64px')
  })
})
