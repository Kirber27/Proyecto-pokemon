import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import SplashView from '@/views/SplashView.vue'
import { useUiStore } from '@/stores/useUiStore'
import { getIndex } from '@/services/pokemonService'
import type { PokemonSummary } from '@/types/domain'

vi.mock('@/services/pokemonService', () => ({
  getIndex: vi.fn(),
}))

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'splash', component: SplashView },
      { path: '/onboarding', name: 'onboarding', component: { template: '<div />' } },
      { path: '/pokedex', name: 'pokedex', component: { template: '<div />' } },
    ],
  })
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  vi.mocked(getIndex).mockReset()
})

describe('SplashView', () => {
  it('precarga el índice y navega a onboarding si no se vio', async () => {
    vi.mocked(getIndex).mockResolvedValue([] as PokemonSummary[])
    const router = buildRouter()
    await router.push('/')

    mount(SplashView, { global: { plugins: [router] } })
    await flushPromises()

    expect(getIndex).toHaveBeenCalledTimes(1)
    expect(router.currentRoute.value.name).toBe('onboarding')
  })

  it('navega directo a /pokedex si el onboarding ya se vio', async () => {
    vi.mocked(getIndex).mockResolvedValue([] as PokemonSummary[])
    const uiStore = useUiStore()
    uiStore.markOnboardingSeen()

    const router = buildRouter()
    await router.push('/')

    mount(SplashView, { global: { plugins: [router] } })
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('pokedex')
  })

  it('muestra Reintentar y no navega si falla el índice', async () => {
    vi.mocked(getIndex).mockRejectedValue(new Error('network'))
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(SplashView, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('Reintentar')
    expect(router.currentRoute.value.name).toBe('splash')
  })

  it('reintentar vuelve a pedir el índice', async () => {
    vi.mocked(getIndex).mockRejectedValueOnce(new Error('network'))
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(SplashView, { global: { plugins: [router] } })
    await flushPromises()

    vi.mocked(getIndex).mockResolvedValueOnce([] as PokemonSummary[])
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(getIndex).toHaveBeenCalledTimes(2)
    expect(router.currentRoute.value.name).toBe('onboarding')
  })
})
