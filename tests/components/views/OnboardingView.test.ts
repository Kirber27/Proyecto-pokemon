import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import OnboardingView from '@/views/OnboardingView.vue'
import { useUiStore } from '@/stores/useUiStore'

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/onboarding', name: 'onboarding', component: OnboardingView },
      { path: '/pokedex', name: 'pokedex', component: { template: '<div />' } },
    ],
  })
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('OnboardingView', () => {
  it('muestra el paso 1 con el botón "Continuar"', async () => {
    const router = buildRouter()
    await router.push('/onboarding')

    const wrapper = mount(OnboardingView, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Continuar')
    expect(wrapper.text()).not.toContain('Empecemos')
  })

  it('avanza al paso 2 y cambia el botón a "Empecemos"', async () => {
    const router = buildRouter()
    await router.push('/onboarding')
    const wrapper = mount(OnboardingView, { global: { plugins: [router] } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Empecemos')
  })

  it('al terminar marca el onboarding como visto y navega a /pokedex', async () => {
    const router = buildRouter()
    await router.push('/onboarding')
    const wrapper = mount(OnboardingView, { global: { plugins: [router] } })
    const uiStore = useUiStore()

    await wrapper.find('button').trigger('click') // → paso 2
    await wrapper.find('button').trigger('click') // → termina
    await flushPromises()

    expect(uiStore.onboardingSeen).toBe(true)
    expect(router.currentRoute.value.name).toBe('pokedex')
  })
})
