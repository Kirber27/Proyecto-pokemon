import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width })
  window.dispatchEvent(new Event('resize'))
}

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'pokedex', component: { template: '<div />' } },
      { path: '/favorites', name: 'favorites', component: { template: '<div />' } },
    ],
  })
}

describe('AppShell', () => {
  it('muestra BottomTabBar y no TopNavBar por debajo de 992px', async () => {
    setWidth(500)
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(AppShell, { global: { plugins: [router] } })

    expect(wrapper.find('.bottom-tab-bar').exists()).toBe(true)
    expect(wrapper.find('.top-nav-bar').exists()).toBe(false)
  })

  it('muestra TopNavBar y no BottomTabBar desde 992px', async () => {
    setWidth(1200)
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(AppShell, { global: { plugins: [router] } })

    expect(wrapper.find('.top-nav-bar').exists()).toBe(true)
    expect(wrapper.find('.bottom-tab-bar').exists()).toBe(false)
  })

  it('renderiza el contenido del slot dentro del PageContainer', async () => {
    setWidth(500)
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(AppShell, {
      global: { plugins: [router] },
      slots: { default: '<p>contenido</p>' },
    })

    expect(wrapper.find('.page-container').text()).toContain('contenido')
  })
})
