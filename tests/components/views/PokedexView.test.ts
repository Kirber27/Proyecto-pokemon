import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import PokedexView from '@/views/PokedexView.vue'
import { usePokemonStore } from '@/stores/usePokemonStore'
import { useUiStore } from '@/stores/useUiStore'
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

function summary(id: number): PokemonSummary {
  return {
    id,
    name: `pokemon-${id}`,
    displayName: `Pokemon ${id}`,
    number: `Nº${id}`,
    artworkUrl: `${id}.png`,
  }
}

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/pokedex', name: 'pokedex', component: PokedexView },
      { path: '/pokedex/:name', name: 'pokedex-detail', component: { template: '<div />' } },
    ],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.mocked(getIndex).mockReset()
  vi.mocked(getDetail).mockReset()
})

describe('PokedexView', () => {
  it('carga el índice al montar y muestra el grid al terminar', async () => {
    vi.mocked(getIndex).mockResolvedValue([summary(1), summary(2)])
    const router = buildRouter()
    await router.push('/pokedex')

    const wrapper = mount(PokedexView, { global: { plugins: [router] } })
    expect(wrapper.find('.pokedex-view__state').exists()).toBe(true) // loading

    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(getIndex).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.pokedex-view__grid').exists()).toBe(true)
    expect(wrapper.find('.pokedex-view__state').exists()).toBe(false)
  })

  it('muestra Reintentar si falla el índice, y reintenta al click', async () => {
    vi.mocked(getIndex).mockRejectedValueOnce(new Error('network'))
    const router = buildRouter()
    await router.push('/pokedex')

    const wrapper = mount(PokedexView, { global: { plugins: [router] } })
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Reintentar')

    vi.mocked(getIndex).mockResolvedValueOnce([summary(1)])
    await wrapper.find('button').trigger('click')
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(getIndex).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.pokedex-view__grid').exists()).toBe(true)
  })

  it('hidrata el detalle de los nombres que el grid marca visibles', async () => {
    vi.mocked(getIndex).mockResolvedValue([summary(1)])
    vi.mocked(getDetail).mockResolvedValue({
      ...summary(1),
      types: ['grass'],
      weightKg: 6.9,
      heightM: 0.7,
      abilities: [],
      stats: [],
    })
    const router = buildRouter()
    await router.push('/pokedex')

    const wrapper = mount(PokedexView, { global: { plugins: [router] } })
    await flushPromises()
    await wrapper.vm.$nextTick()

    // PokemonGrid debouncea @visible 100ms — hace falta tiempo real, no solo un flush.
    await new Promise((resolve) => setTimeout(resolve, 150))
    await flushPromises()

    const pokemonStore = usePokemonStore()
    expect(pokemonStore.details.has('pokemon-1')).toBe(true)
  })

  it('muestra el estado sin resultados con el término buscado (CA-03.3)', async () => {
    vi.mocked(getIndex).mockResolvedValue([summary(1)])
    const router = buildRouter()
    await router.push('/pokedex')

    const wrapper = mount(PokedexView, { global: { plugins: [router] } })
    await flushPromises()
    await wrapper.vm.$nextTick()

    const uiStore = useUiStore()
    uiStore.setQuery('no-existe')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Sin resultados')
    expect(wrapper.text()).toContain('no-existe')
    expect(wrapper.find('.pokedex-view__grid').exists()).toBe(false)
  })

  it('hidrata búsqueda y tipo desde la query string al montar (CA-03.4)', async () => {
    vi.mocked(getIndex).mockResolvedValue([summary(1)])
    const router = buildRouter()
    await router.push('/pokedex?q=char&types=fire%2Cwater')

    mount(PokedexView, { global: { plugins: [router] } })
    await flushPromises()

    const uiStore = useUiStore()
    expect(uiStore.query).toBe('char')
    expect([...uiStore.selectedTypes]).toEqual(['fire', 'water'])
  })

  it('refleja la búsqueda en la query string al cambiarla (CA-03.4)', async () => {
    vi.mocked(getIndex).mockResolvedValue([summary(1)])
    const router = buildRouter()
    await router.push('/pokedex')

    mount(PokedexView, { global: { plugins: [router] } })
    await flushPromises()

    const uiStore = useUiStore()
    uiStore.setQuery('pika')
    await flushPromises()
    await router.isReady()

    expect(router.currentRoute.value.query.q).toBe('pika')
  })
})
