import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import FavoritesView from '@/views/FavoritesView.vue'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import { getDetail, getIndex } from '@/services/pokemonService'
import type { PokemonSummary } from '@/types/domain'

vi.mock('@/services/pokemonService', () => ({
  getIndex: vi.fn(),
  getDetail: vi.fn(),
  getSpecies: vi.fn(),
  getTypeInfo: vi.fn(),
}))

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

function summary(id: number, name: string): PokemonSummary {
  return { id, name, displayName: name, number: `Nº${id}`, artworkUrl: `${id}.png` }
}

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/pokedex/:name', name: 'pokedex-detail', component: { template: '<div />' } }],
  })
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  vi.mocked(getIndex).mockReset()
  vi.mocked(getDetail).mockReset()
})

describe('FavoritesView', () => {
  it('muestra el estado vacío del diseño cuando no hay favoritos (CA-06.5)', async () => {
    vi.mocked(getIndex).mockResolvedValue([])
    const router = buildRouter()
    const wrapper = mount(FavoritesView, { global: { plugins: [router] } })
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('No has marcado ningún Pokémon como favorito')
    expect(wrapper.text()).toContain('Haz clic en el ícono de corazón')
    expect(wrapper.find('.empty-state__image').attributes('src')).toContain('magikarp')
  })

  it('lista solo los favoritos, con PokemonCard (CA-06.3)', async () => {
    vi.mocked(getIndex).mockResolvedValue([
      summary(1, 'Bulbasaur'),
      summary(2, 'Ivysaur'),
      summary(3, 'Venusaur'),
    ])
    const favoritesStore = useFavoritesStore()
    favoritesStore.toggle(1)
    favoritesStore.toggle(3)

    const router = buildRouter()
    const wrapper = mount(FavoritesView, { global: { plugins: [router] } })
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Bulbasaur')
    expect(wrapper.text()).toContain('Venusaur')
    expect(wrapper.text()).not.toContain('Ivysaur')
  })

  it('hidrata el detalle de los favoritos al montar', async () => {
    vi.mocked(getIndex).mockResolvedValue([summary(1, 'Bulbasaur')])
    vi.mocked(getDetail).mockResolvedValue({
      ...summary(1, 'Bulbasaur'),
      types: ['grass'],
      weightKg: 6.9,
      heightM: 0.7,
      abilities: [],
      stats: [],
    })
    const favoritesStore = useFavoritesStore()
    favoritesStore.toggle(1)

    const router = buildRouter()
    mount(FavoritesView, { global: { plugins: [router] } })
    await flushPromises()

    expect(getDetail).toHaveBeenCalledWith('Bulbasaur')
  })

  it('mientras resuelve ids guardados contra el índice, no muestra el estado vacío de más', async () => {
    localStorage.setItem('pokedex:favorites', '[1]')
    let resolveIndex!: (value: PokemonSummary[]) => void
    vi.mocked(getIndex).mockReturnValue(
      new Promise((resolve) => {
        resolveIndex = resolve
      }),
    )

    const router = buildRouter()
    const wrapper = mount(FavoritesView, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('No has marcado ningún Pokémon como favorito')

    resolveIndex([summary(1, 'Bulbasaur')])
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Bulbasaur')
  })
})
