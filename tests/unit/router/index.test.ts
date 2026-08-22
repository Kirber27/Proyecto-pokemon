import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { onboardingGuard, routes } from '@/router'
import { useUiStore } from '@/stores/useUiStore'

function buildRouter() {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.beforeEach(onboardingGuard)
  return router
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('routes', () => {
  it('define las 6 rutas del diseño', () => {
    const names = routes.map((route) => route.name)

    expect(names).toEqual(['splash', 'onboarding', 'pokedex', 'pokedex-detail', 'favorites', 'not-found'])
  })

  it('resuelve /pokedex/:name con el param name', async () => {
    const uiStore = useUiStore()
    uiStore.markOnboardingSeen()

    const router = buildRouter()
    await router.push('/pokedex/bulbasaur')

    expect(router.currentRoute.value.name).toBe('pokedex-detail')
    expect(router.currentRoute.value.params.name).toBe('bulbasaur')
  })

  it('cualquier ruta desconocida cae en el catch-all', async () => {
    const router = buildRouter()
    await router.push('/algo-que-no-existe')

    expect(router.currentRoute.value.name).toBe('not-found')
  })
})

describe('onboardingGuard', () => {
  it('redirige a /onboarding si se intenta entrar a Pokédex sin onboarding visto', async () => {
    const router = buildRouter()

    await router.push('/pokedex')

    expect(router.currentRoute.value.name).toBe('onboarding')
  })

  it('redirige a /onboarding en un deep link directo al detalle', async () => {
    const router = buildRouter()

    await router.push('/pokedex/bulbasaur')

    expect(router.currentRoute.value.name).toBe('onboarding')
  })

  it('redirige a /onboarding al intentar entrar a Favoritos', async () => {
    const router = buildRouter()

    await router.push('/favorites')

    expect(router.currentRoute.value.name).toBe('onboarding')
  })

  it('deja pasar a Pokédex si el onboarding ya se vio', async () => {
    const uiStore = useUiStore()
    uiStore.markOnboardingSeen()

    const router = buildRouter()
    await router.push('/pokedex')

    expect(router.currentRoute.value.name).toBe('pokedex')
  })

  it('no bloquea la splash ni el propio onboarding', async () => {
    const router = buildRouter()

    await router.push('/onboarding')
    expect(router.currentRoute.value.name).toBe('onboarding')

    await router.push('/')
    expect(router.currentRoute.value.name).toBe('splash')
  })
})
