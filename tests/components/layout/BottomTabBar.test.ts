import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import BottomTabBar from '@/components/layout/BottomTabBar.vue'

function buildRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/pokedex', name: 'pokedex', component: { template: '<div />' } },
      { path: '/favorites', name: 'favorites', component: { template: '<div />' } },
      { path: '/regions', name: 'regions', component: { template: '<div />' } },
      { path: '/profile', name: 'profile', component: { template: '<div />' } },
    ],
  })
}

describe('BottomTabBar', () => {
  it('renderiza los 4 ítems, todos navegables', async () => {
    const router = buildRouter()
    await router.push('/pokedex')

    const wrapper = mount(BottomTabBar, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Pokédex')
    expect(wrapper.text()).toContain('Regiones')
    expect(wrapper.text()).toContain('Favoritos')
    expect(wrapper.text()).toContain('Perfil')
    // Regiones y Perfil ya no están deshabilitados: llevan al placeholder de construcción.
    expect(wrapper.findAll('a')).toHaveLength(4)
    expect(wrapper.findAll('[aria-disabled="true"]')).toHaveLength(0)
  })

  it('marca activo el ítem de la ruta actual', async () => {
    const router = buildRouter()
    await router.push('/favorites')

    const wrapper = mount(BottomTabBar, { global: { plugins: [router] } })
    const active = wrapper.find('.bottom-tab-bar__item--active')

    expect(active.text()).toContain('Favoritos')
  })
})
