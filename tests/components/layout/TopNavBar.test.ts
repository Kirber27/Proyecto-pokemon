import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import TopNavBar from '@/components/layout/TopNavBar.vue'

function buildRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/pokedex', name: 'pokedex', component: { template: '<div />' } },
      { path: '/favorites', name: 'favorites', component: { template: '<div />' } },
    ],
  })
}

describe('TopNavBar', () => {
  it('muestra el logo y los 4 ítems de navegación', async () => {
    const router = buildRouter()
    await router.push('/pokedex')

    const wrapper = mount(TopNavBar, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Pokédex')
    expect(wrapper.text()).toContain('Favoritos')
    expect(wrapper.findAll('[aria-disabled="true"]')).toHaveLength(2)
  })

  it('marca activo el ítem de la ruta actual', async () => {
    const router = buildRouter()
    await router.push('/favorites')

    const wrapper = mount(TopNavBar, { global: { plugins: [router] } })
    const active = wrapper.find('.top-nav-bar__item--active')

    expect(active.text()).toBe('Favoritos')
  })
})
