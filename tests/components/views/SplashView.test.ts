import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

// La splash se queda un mínimo en pantalla, así que hay que correr el reloj: con
// timers reales estos tests esperarían ese tiempo de verdad en cada corrida.
const PAST_MIN_VISIBLE_MS = 2000

/** Avanza el reloj y vacía la cola de microtareas (promesas) en el camino. */
async function settle(ms = PAST_MIN_VISIBLE_MS): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms)
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
  vi.useFakeTimers()
  localStorage.clear()
  setActivePinia(createPinia())
  vi.mocked(getIndex).mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('SplashView', () => {
  it('precarga el índice y navega a onboarding si no se vio', async () => {
    vi.mocked(getIndex).mockResolvedValue([] as PokemonSummary[])
    const router = buildRouter()
    await router.push('/')

    mount(SplashView, { global: { plugins: [router] } })
    await settle()

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
    await settle()

    expect(router.currentRoute.value.name).toBe('pokedex')
  })

  // Sin el piso de tiempo, con el índice ya resuelto la Pokébola desaparecía
  // instantáneamente y no se alcanzaba a ver.
  it('se mantiene en pantalla aunque el índice resuelva de inmediato', async () => {
    vi.mocked(getIndex).mockResolvedValue([] as PokemonSummary[])
    const router = buildRouter()
    await router.push('/')

    mount(SplashView, { global: { plugins: [router] } })
    await settle(200)

    expect(router.currentRoute.value.name).toBe('splash')

    await settle()

    expect(router.currentRoute.value.name).toBe('onboarding')
  })

  it('muestra Reintentar y no navega si falla el índice', async () => {
    vi.mocked(getIndex).mockRejectedValue(new Error('network'))
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(SplashView, { global: { plugins: [router] } })
    await settle()

    expect(wrapper.text()).toContain('Reintentar')
    expect(router.currentRoute.value.name).toBe('splash')
  })

  it('reintentar vuelve a pedir el índice', async () => {
    vi.mocked(getIndex).mockRejectedValueOnce(new Error('network'))
    const router = buildRouter()
    await router.push('/')

    const wrapper = mount(SplashView, { global: { plugins: [router] } })
    await settle()

    vi.mocked(getIndex).mockResolvedValueOnce([] as PokemonSummary[])
    await wrapper.find('button').trigger('click')
    await settle()

    expect(getIndex).toHaveBeenCalledTimes(2)
    expect(router.currentRoute.value.name).toBe('onboarding')
  })
})
