import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '@/components/pokemon/StatCard.vue'

describe('StatCard', () => {
  it('muestra la etiqueta y el valor', () => {
    const wrapper = mount(StatCard, { props: { label: 'Peso', value: '6,9 kg' } })

    expect(wrapper.find('.stat-card__label').text()).toBe('Peso')
    expect(wrapper.find('.stat-card__value').text()).toBe('6,9 kg')
  })
})
