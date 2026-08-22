import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '@/components/pokemon/StatCard.vue'

describe('StatCard', () => {
  it('muestra la etiqueta y el valor', () => {
    const wrapper = mount(StatCard, { props: { label: 'Peso', value: '6,9 kg' } })

    expect(wrapper.text()).toContain('Peso')
    expect(wrapper.text()).toContain('6,9 kg')
  })
})
