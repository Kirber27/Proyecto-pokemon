import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import FavoriteCard from '@/components/pokemon/FavoriteCard.vue'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import type { PokemonSummary } from '@/types/domain'

const summary: PokemonSummary = {
  id: 1,
  name: 'bulbasaur',
  displayName: 'Bulbasaur',
  number: 'Nº001',
  artworkUrl: '1.png',
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

describe('FavoriteCard', () => {
  it('quitar favorito llama a favoritesStore.remove', async () => {
    const favoritesStore = useFavoritesStore()
    favoritesStore.toggle(1)
    const router = buildRouter()

    const wrapper = mount(FavoriteCard, { props: { summary }, global: { plugins: [router] } })
    await wrapper.find('.favorite-card__delete-button').trigger('click')

    expect(favoritesStore.isFavorite(1)).toBe(false)
  })

  it('deslizar hacia la izquierda revela la acción de borrar (CA-06.4)', async () => {
    const router = buildRouter()
    const wrapper = mount(FavoriteCard, { props: { summary }, global: { plugins: [router] } })
    const content = wrapper.find('.favorite-card__content')

    await content.trigger('touchstart', { touches: [{ clientX: 200 }] })
    await content.trigger('touchmove', { touches: [{ clientX: 100 }] }) // arrastra -100, clamp -72
    await content.trigger('touchend')

    expect(content.attributes('style')).toContain('translateX(-72px)')
  })

  it('si el arrastre no llega a la mitad, vuelve a cerrarse', async () => {
    const router = buildRouter()
    const wrapper = mount(FavoriteCard, { props: { summary }, global: { plugins: [router] } })
    const content = wrapper.find('.favorite-card__content')

    await content.trigger('touchstart', { touches: [{ clientX: 200 }] })
    await content.trigger('touchmove', { touches: [{ clientX: 190 }] }) // arrastra -10, poco
    await content.trigger('touchend')

    expect(content.attributes('style')).toBeFalsy()
  })

  it('renderiza el mismo PokemonCard (CA-06.3)', () => {
    const router = buildRouter()
    const wrapper = mount(FavoriteCard, { props: { summary }, global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Bulbasaur')
    expect(wrapper.text()).toContain('Nº001')
  })
})
