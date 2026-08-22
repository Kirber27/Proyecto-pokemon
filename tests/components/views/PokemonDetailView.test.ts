import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import PokemonDetailView from '@/views/PokemonDetailView.vue'
import { getDetail, getSpecies, getTypeInfo } from '@/services/pokemonService'
import type { PokemonDetail } from '@/types/domain'

vi.mock('@/services/pokemonService', () => ({
  getIndex: vi.fn(),
  getDetail: vi.fn(),
  getSpecies: vi.fn(),
  getTypeInfo: vi.fn(),
}))

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

function detail(name: string): PokemonDetail {
  return {
    id: 1,
    name,
    displayName: 'Bulbasaur',
    number: 'Nº001',
    artworkUrl: '1.png',
    types: ['grass'],
    weightKg: 6.9,
    heightM: 0.7,
    abilities: [],
    stats: [],
  }
}

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/pokedex', name: 'pokedex', component: { template: '<div />' } },
      { path: '/pokedex/:name', name: 'pokedex-detail', component: PokemonDetailView },
    ],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.mocked(getDetail).mockReset()
  vi.mocked(getSpecies).mockReset()
  vi.mocked(getTypeInfo).mockReset()
  vi.mocked(getTypeInfo).mockResolvedValue({ weaknesses: [], members: [] })
  vi.mocked(getSpecies).mockResolvedValue({})
})

describe('PokemonDetailView', () => {
  it('carga el detalle según :name de la ruta y lo muestra', async () => {
    vi.mocked(getDetail).mockResolvedValue(detail('bulbasaur'))
    const router = buildRouter()
    await router.push('/pokedex/bulbasaur')

    const wrapper = mount(PokemonDetailView, { global: { plugins: [router] } })
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Bulbasaur')
  })

  it('volver navega a /pokedex (CA-05.2)', async () => {
    vi.mocked(getDetail).mockRejectedValue(new Error('down'))
    const router = buildRouter()
    await router.push('/pokedex/bulbasaur')

    const wrapper = mount(PokemonDetailView, { global: { plugins: [router] } })
    await flushPromises()
    await wrapper.vm.$nextTick()

    await wrapper.find('button').trigger('click') // Volver
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('pokedex')
  })

  it('funciona con deep link directo (F5) — no depende de haber navegado desde el grid', async () => {
    vi.mocked(getDetail).mockResolvedValue(detail('bulbasaur'))
    const router = buildRouter()
    await router.push('/pokedex/bulbasaur') // simula entrar directo por URL

    const wrapper = mount(PokemonDetailView, { global: { plugins: [router] } })
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(getDetail).toHaveBeenCalledWith('bulbasaur')
    expect(wrapper.text()).toContain('Bulbasaur')
  })
})
