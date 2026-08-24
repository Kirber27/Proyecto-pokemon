import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import { POKEMON_CARD_HEIGHT } from '@/components/pokemon/gridLayout'
import type { PokemonDetail, PokemonSummary } from '@/types/domain'

const summary: PokemonSummary = {
  id: 1,
  name: 'bulbasaur',
  displayName: 'Bulbasaur',
  number: 'Nº001',
  artworkUrl: 'https://example.com/1.png',
}

const detail: PokemonDetail = {
  ...summary,
  types: ['grass', 'poison'],
  weightKg: 6.9,
  heightM: 0.7,
  abilities: ['Overgrow'],
  stats: [{ name: 'hp', value: 45 }],
}

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/pokedex/:name', name: 'pokedex-detail', component: { template: '<div />' } },
    ],
  })
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('PokemonCard', () => {
  it('muestra número, nombre y sprite desde el summary aunque no haya detalle', async () => {
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(PokemonCard, {
      props: { summary },
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Nº001')
    expect(wrapper.text()).toContain('Bulbasaur')
    expect(wrapper.find('img').attributes('src')).toBe(summary.artworkUrl)
  })

  it('muestra skeletons de tipo mientras no hay detalle (CA-02.4)', async () => {
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(PokemonCard, {
      props: { summary },
      global: { plugins: [router] },
    })

    expect(wrapper.findAll('.app-skeleton')).toHaveLength(2)
    expect(wrapper.findComponent({ name: 'PokemonTypeChip' }).exists()).toBe(false)
  })

  it('muestra los chips de tipo reales cuando llega el detalle', async () => {
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(PokemonCard, {
      props: { summary, detail },
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Planta')
    expect(wrapper.text()).toContain('Veneno')
    // El tema del tipo vive en la raíz: tiñe la card entera y el panel hereda las vars.
    expect(wrapper.find('.pokemon-card').attributes('data-type')).toBe('grass')
    expect(wrapper.find('.pokemon-card__art').attributes('data-type')).toBeUndefined()
  })

  it('no aplica tono de tipo mientras no llega el detalle', async () => {
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(PokemonCard, {
      props: { summary },
      global: { plugins: [router] },
    })

    // Sin tipo no hay data-type, así que la card cae al fallback neutro en vez de
    // parpadear a un color intermedio mientras carga.
    expect(wrapper.find('.pokemon-card').attributes('data-type')).toBeUndefined()
  })

  it('mantiene una altura fija compartida con el virtualizador', async () => {
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(PokemonCard, {
      props: { summary },
      global: { plugins: [router] },
    })

    expect(wrapper.attributes('style')).toContain(`height: ${POKEMON_CARD_HEIGHT}px`)
  })

  it('el FavoriteButton no queda anidado dentro del link (HTML inválido)', async () => {
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(PokemonCard, {
      props: { summary },
      global: { plugins: [router] },
    })

    const link = wrapper.find('.pokemon-card__link')
    expect(link.find('button').exists()).toBe(false)
    expect(wrapper.find('button.favorite-button').exists()).toBe(true)
  })
})
