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

  it('muestra el título, el texto y la ilustración del paso 1', async () => {
    const router = buildRouter()
    await router.push('/onboarding')
    const wrapper = mount(OnboardingView, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Todos los Pokémon en un solo lugar')
    expect(wrapper.text()).toContain('todas las generaciones creadas por Nintendo')

    const img = wrapper.find('.onboarding-view__image')
    expect(img.attributes('src')).toContain('onboarding-1')
    expect(img.attributes('alt')).toBeTruthy()
  })

  it('cambia título e ilustración al pasar al paso 2', async () => {
    const router = buildRouter()
    await router.push('/onboarding')
    const wrapper = mount(OnboardingView, { global: { plugins: [router] } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Mantén tu Pokédex actualizada')
    expect(wrapper.text()).not.toContain('Todos los Pokémon en un solo lugar')
    expect(wrapper.find('.onboarding-view__image').attributes('src')).toContain('onboarding-2')
  })

  it('marca como activo el punto del paso actual', async () => {
    const router = buildRouter()
    await router.push('/onboarding')
    const wrapper = mount(OnboardingView, { global: { plugins: [router] } })

    const dots = () => wrapper.findAll('.onboarding-view__dot')
    expect(dots()).toHaveLength(2)
    expect(dots()[0]!.classes()).toContain('onboarding-view__dot--active')
    expect(dots()[1]!.classes()).not.toContain('onboarding-view__dot--active')

    await wrapper.find('button').trigger('click')

    expect(dots()[0]!.classes()).not.toContain('onboarding-view__dot--active')
    expect(dots()[1]!.classes()).toContain('onboarding-view__dot--active')
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
