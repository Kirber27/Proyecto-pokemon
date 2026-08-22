import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '@/stores/useUiStore'
import { usePokemonStore } from '@/stores/usePokemonStore'
import { getTypeInfo } from '@/services/pokemonService'
import type { PokemonSummary } from '@/types/domain'

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

vi.mock('@/services/pokemonService', () => ({
  getIndex: vi.fn(),
  getDetail: vi.fn(),
  getSpecies: vi.fn(),
  getTypeInfo: vi.fn(),
}))

function summary(id: number, displayName: string): PokemonSummary {
  return {
    id,
    name: displayName.toLowerCase(),
    displayName,
    number: `Nº${id}`,
    artworkUrl: `${id}.png`,
  }
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  vi.mocked(getTypeInfo).mockReset()
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

describe('visibleResults', () => {
  it('sin búsqueda ni filtro, devuelve el índice completo', () => {
    const pokemonStore = usePokemonStore()
    pokemonStore.index = [summary(1, 'Bulbasaur'), summary(4, 'Charmander')]
    const uiStore = useUiStore()

    expect(uiStore.visibleResults).toHaveLength(2)
  })

  it('filtra por búsqueda, sin distinguir mayúsculas ni acentos', () => {
    const pokemonStore = usePokemonStore()
    pokemonStore.index = [summary(1, 'Bulbasaur'), summary(4, 'Charmander')]
    const uiStore = useUiStore()

    uiStore.setQuery('CHAR')

    expect(uiStore.visibleResults).toEqual([summary(4, 'Charmander')])
  })

  it('pide la info del tipo recién seleccionado (para el filtro exacto)', async () => {
    vi.mocked(getTypeInfo).mockResolvedValue({ weaknesses: [], members: ['bulbasaur'] })
    const uiStore = useUiStore()

    uiStore.toggleType('grass')
    await flushPromises()

    expect(getTypeInfo).toHaveBeenCalledWith('grass')
  })

  it('filtra por tipo una vez que la info de ese tipo llegó al caché', async () => {
    const pokemonStore = usePokemonStore()
    pokemonStore.index = [summary(1, 'Bulbasaur'), summary(4, 'Charmander')]
    vi.mocked(getTypeInfo).mockResolvedValue({ weaknesses: [], members: ['bulbasaur'] })
    const uiStore = useUiStore()

    uiStore.toggleType('grass')
    await flushPromises()

    expect(uiStore.visibleResults).toEqual([summary(1, 'Bulbasaur')])
  })

  it('compone búsqueda y filtro simultáneamente (CA-04.5)', async () => {
    const pokemonStore = usePokemonStore()
    pokemonStore.index = [
      summary(1, 'Bulbasaur'),
      summary(2, 'Ivysaur'),
      summary(4, 'Charmander'),
    ]
    vi.mocked(getTypeInfo).mockResolvedValue({
      weaknesses: [],
      members: ['bulbasaur', 'ivysaur'],
    })
    const uiStore = useUiStore()

    uiStore.toggleType('grass')
    uiStore.setQuery('bulba')
    await flushPromises()

    expect(uiStore.visibleResults).toEqual([summary(1, 'Bulbasaur')])
  })
})
