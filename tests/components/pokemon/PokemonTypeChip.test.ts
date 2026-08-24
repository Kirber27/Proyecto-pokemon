import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PokemonTypeChip from '@/components/pokemon/PokemonTypeChip.vue'
import { TYPE_ICONS } from '@/assets/types'
import { ALL_POKEMON_TYPES } from '@/types/domain'

describe('PokemonTypeChip', () => {
  it('muestra el nombre en español y el data-type para el theming por SCSS', () => {
    const wrapper = mount(PokemonTypeChip, { props: { type: 'grass' } })

    expect(wrapper.text()).toBe('Planta')
    expect(wrapper.attributes('data-type')).toBe('grass')
  })

  it('muestra el ícono del tipo', () => {
    const wrapper = mount(PokemonTypeChip, { props: { type: 'grass' } })

    expect(wrapper.find('.pokemon-type-chip__icon').attributes('src')).toBe(TYPE_ICONS.grass)
  })

  // El nombre ya está en el texto del chip: repetirlo en el alt lo haría sonar dos veces.
  it('trata el ícono como decorativo', () => {
    const wrapper = mount(PokemonTypeChip, { props: { type: 'grass' } })

    expect(wrapper.find('.pokemon-type-chip__icon').attributes('alt')).toBe('')
    expect(wrapper.find('.pokemon-type-chip__badge').attributes('aria-hidden')).toBe('true')
  })

  it.each(ALL_POKEMON_TYPES)('resuelve el ícono de %s', (type) => {
    const wrapper = mount(PokemonTypeChip, { props: { type } })

    expect(wrapper.find('.pokemon-type-chip__icon').attributes('src')).toBeTruthy()
  })
})

describe('TYPE_ICONS', () => {
  it('cubre los 18 tipos, sin duplicados', () => {
    const icons = ALL_POKEMON_TYPES.map((type) => TYPE_ICONS[type])

    expect(icons).toHaveLength(18)
    expect(icons.every(Boolean)).toBe(true)
    // Un copy-paste en el mapa daría dos tipos con el mismo archivo.
    expect(new Set(icons).size).toBe(18)
  })
})
