import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '@/stores/useUiStore'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('query', () => {
  it('actualiza el término de búsqueda', () => {
    const store = useUiStore()

    store.setQuery('char')

    expect(store.query).toBe('char')
  })
})

describe('selectedTypes', () => {
  it('togglea un tipo', () => {
    const store = useUiStore()

    store.toggleType('fire')
    expect(store.selectedTypes.has('fire')).toBe(true)

    store.toggleType('fire')
    expect(store.selectedTypes.has('fire')).toBe(false)
  })

  it('setSelectedTypes reemplaza el conjunto completo', () => {
    const store = useUiStore()

    store.setSelectedTypes(['fire', 'water'])

    expect([...store.selectedTypes]).toEqual(['fire', 'water'])
  })

  it('clearTypes vacía la selección', () => {
    const store = useUiStore()
    store.setSelectedTypes(['fire'])

    store.clearTypes()

    expect(store.selectedTypes.size).toBe(0)
  })
})

describe('onboardingSeen', () => {
  it('arranca en false y persiste al marcarlo', () => {
    const store = useUiStore()
    expect(store.onboardingSeen).toBe(false)

    store.markOnboardingSeen()

    expect(store.onboardingSeen).toBe(true)
    expect(localStorage.getItem('pokedex:onboarding-seen')).toBe('1')
  })

  it('una nueva instancia respeta el onboarding ya visto', () => {
    const first = useUiStore()
    first.markOnboardingSeen()

    setActivePinia(createPinia())
    const second = useUiStore()

    expect(second.onboardingSeen).toBe(true)
  })
})
