import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import RegionsView from '@/views/RegionsView.vue'
import ProfileView from '@/views/ProfileView.vue'

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/pokedex', name: 'pokedex', component: { template: '<div />' } },
      { path: '/regions', name: 'regions', component: { template: '<div />' } },
      { path: '/profile', name: 'profile', component: { template: '<div />' } },
    ],
  })
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe.each([
  { name: 'RegionsView', component: RegionsView, heading: 'Regiones', path: '/regions' },
  { name: 'ProfileView', component: ProfileView, heading: 'Perfil', path: '/profile' },
])('$name', ({ component, heading, path }) => {
  it('muestra el placeholder de construcción', async () => {
    const router = buildRouter()
    await router.push(path)

    const wrapper = mount(component, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('¡Muy pronto disponible!')
    expect(wrapper.find('.empty-state__image').attributes('src')).toContain('jigglypuff')
  })

  it(`muestra el header con el título de la sección (${heading})`, async () => {
    const router = buildRouter()
    await router.push(path)

    const wrapper = mount(component, { global: { plugins: [router] } })

    expect(wrapper.find('h1').text()).toBe(heading)
    expect(wrapper.find('.page-header__back').exists()).toBe(true)
  })

  it('el botón de volver lleva a la Pokédex', async () => {
    const router = buildRouter()
    await router.push(path)

    const wrapper = mount(component, { global: { plugins: [router] } })

    await wrapper.find('.page-header__back').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('pokedex')
  })
})
