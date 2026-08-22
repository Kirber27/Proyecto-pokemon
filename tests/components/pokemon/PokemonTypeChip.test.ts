import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PokemonTypeChip from '@/components/pokemon/PokemonTypeChip.vue'

describe('PokemonTypeChip', () => {
  it('muestra el nombre en español y el data-type para el theming por SCSS', () => {
    const wrapper = mount(PokemonTypeChip, { props: { type: 'grass' } })

    expect(wrapper.text()).toBe('Planta')
    expect(wrapper.attributes('data-type')).toBe('grass')
  })
})
