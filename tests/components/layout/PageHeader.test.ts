import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/pokedex', name: 'pokedex', component: { template: '<div />' } },
      { path: '/favorites', name: 'favorites', component: { template: '<div />' } },
    ],
  })
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('PageHeader', () => {
  it('muestra el título recibido en un h1', async () => {
    const router = buildRouter()
    await router.push('/favorites')

    const wrapper = mount(PageHeader, {
      props: { title: 'Favoritos' },
      global: { plugins: [router] },
    })

    expect(wrapper.find('h1').text()).toBe('Favoritos')
  })

  it('el botón de volver lleva a la Pokédex', async () => {
    const router = buildRouter()
    await router.push('/favorites')

    const wrapper = mount(PageHeader, {
      props: { title: 'Favoritos' },
      global: { plugins: [router] },
    })

    const back = wrapper.find('.page-header__back')
    expect(back.attributes('aria-label')).toBe('Volver')

    await back.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('pokedex')
  })

  it('el botón de volver va antes del título en el DOM', async () => {
    const router = buildRouter()
    await router.push('/favorites')

    const wrapper = mount(PageHeader, {
      props: { title: 'Favoritos' },
      global: { plugins: [router] },
    })

    const children = [...wrapper.find('.page-header').element.children].map((el) => el.className)

    expect(children[0]).toContain('page-header__back')
    expect(children[1]).toContain('page-header__title')
  })
})
