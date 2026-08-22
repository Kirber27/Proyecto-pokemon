import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ResultsSummary from '@/components/search/ResultsSummary.vue'
import { useUiStore } from '@/stores/useUiStore'
import { usePokemonStore } from '@/stores/usePokemonStore'
import type { PokemonSummary } from '@/types/domain'

function summary(id: number, name: string): PokemonSummary {
  return { id, name, displayName: name, number: `Nº${id}`, artworkUrl: `${id}.png` }
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('ResultsSummary', () => {
  it('no muestra nada sin filtros activos (CA-04.4)', () => {
    const wrapper = mount(ResultsSummary)

    expect(wrapper.find('.results-summary').exists()).toBe(false)
  })

  it('con filtros activos, muestra el conteo y "Borrar filtro"', () => {
    const pokemonStore = usePokemonStore()
    pokemonStore.index = [summary(1, 'bulbasaur'), summary(4, 'charmander')]
    const uiStore = useUiStore()
    uiStore.setSelectedTypes(['grass'])

    const wrapper = mount(ResultsSummary)

    expect(wrapper.text()).toContain('Borrar filtro')
    expect(wrapper.text()).toContain('resultados')
  })

  it('"Borrar filtro" limpia los tipos seleccionados', async () => {
    const uiStore = useUiStore()
    uiStore.setSelectedTypes(['grass'])
    const wrapper = mount(ResultsSummary)

    await wrapper.find('.results-summary__clear').trigger('click')

    expect(uiStore.selectedTypes.size).toBe(0)
  })
})
