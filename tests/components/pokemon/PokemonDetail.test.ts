import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PokemonDetail from '@/components/pokemon/PokemonDetail.vue'
import type { PokemonDetail as PokemonDetailModel } from '@/types/domain'

const fullDetail: PokemonDetailModel = {
  id: 1,
  name: 'bulbasaur',
  displayName: 'Bulbasaur',
  number: 'Nº001',
  artworkUrl: '1.png',
  types: ['grass', 'poison'],
  weightKg: 6.9,
  heightM: 0.7,
  abilities: ['Overgrow', 'Chlorophyll'],
  stats: [{ name: 'hp', value: 45 }],
  description: 'Una rara semilla.',
  category: 'Semilla',
  genderRatio: { male: 87.5, female: 12.5 },
  weaknesses: ['fire', 'ice', 'flying', 'psychic'],
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('PokemonDetail', () => {
  it('muestra hero, nombre, número, chips, descripción, stats, género y debilidades (CA-05.1)', () => {
    const wrapper = mount(PokemonDetail, { props: { detail: fullDetail } })

    expect(wrapper.find('.pokemon-detail').attributes('data-type')).toBe('grass')
    expect(wrapper.text()).toContain('Bulbasaur')
    expect(wrapper.text()).toContain('Nº001')
    expect(wrapper.text()).toContain('Planta')
    expect(wrapper.text()).toContain('Veneno')
    expect(wrapper.text()).toContain('Una rara semilla.')
    expect(wrapper.text()).toContain('6,9 kg')
    expect(wrapper.text()).toContain('0,7 m')
    expect(wrapper.text()).toContain('Semilla')
    expect(wrapper.text()).toContain('Overgrow')
    expect(wrapper.text()).toContain('Debilidades')
    expect(wrapper.text()).toContain('Género')
    expect(wrapper.text()).toContain('87,5%') // sin redondear, como el diseño
  })

  // Regresión: el mixin de tema estaba en .pokemon-detail__hero, que no lleva data-type,
  // así que el selector no hacía match y el hero se quedaba con el gris del fallback en
  // vez del color del tipo. El atributo y el mixin tienen que vivir en el mismo elemento.
  it('expone data-type en la raíz, que es donde el tema define las variables', () => {
    const wrapper = mount(PokemonDetail, { props: { detail: fullDetail } })

    expect(wrapper.find('.pokemon-detail').attributes('data-type')).toBe('grass')
    expect(wrapper.find('.pokemon-detail__hero').attributes('data-type')).toBeUndefined()
  })

  it('emite close al presionar volver', async () => {
    const wrapper = mount(PokemonDetail, { props: { detail: fullDetail } })

    await wrapper.find('.pokemon-detail__back').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('degrada solo las secciones sin datos, sin romper el resto (CA-05.4)', () => {
    const partial: PokemonDetailModel = {
      ...fullDetail,
      description: undefined,
      category: undefined,
      genderRatio: null,
      weaknesses: undefined,
    }
    const wrapper = mount(PokemonDetail, { props: { detail: partial } })

    expect(wrapper.text()).toContain('Bulbasaur') // lo base sigue ahí
    expect(wrapper.find('.pokemon-detail__description').exists()).toBe(false)
    expect(wrapper.find('.pokemon-detail__gender').exists()).toBe(false)
    expect(wrapper.find('.pokemon-detail__weaknesses').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Categoría')
  })
})
