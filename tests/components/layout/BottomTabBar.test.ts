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
    ],
  })
}

describe('BottomTabBar', () => {
  it('renderiza los 4 ítems, con Regiones y Perfil deshabilitados', async () => {
    const router = buildRouter()
    await router.push('/pokedex')

    const wrapper = mount(BottomTabBar, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Pokédex')
    expect(wrapper.text()).toContain('Regiones')
    expect(wrapper.text()).toContain('Favoritos')
    expect(wrapper.text()).toContain('Perfil')
    expect(wrapper.findAll('a')).toHaveLength(2)
    expect(wrapper.findAll('[aria-disabled="true"]')).toHaveLength(2)
  })

  it('marca activo el ítem de la ruta actual', async () => {
    const router = buildRouter()
    await router.push('/favorites')

    const wrapper = mount(BottomTabBar, { global: { plugins: [router] } })
    const active = wrapper.find('.bottom-tab-bar__item--active')

    expect(active.text()).toContain('Favoritos')
  })
})
