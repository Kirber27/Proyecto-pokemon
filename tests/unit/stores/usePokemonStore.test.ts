import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePokemonStore } from '@/stores/usePokemonStore'
import { getDetail, getIndex, getSpecies, getTypeInfo } from '@/services/pokemonService'
import type { PokemonDetail, PokemonSummary } from '@/types/domain'

vi.mock('@/services/pokemonService', () => ({
  getIndex: vi.fn(),
  getDetail: vi.fn(),
  getSpecies: vi.fn(),
  getTypeInfo: vi.fn(),
}))

function summary(name: string, id: number): PokemonSummary {
  return { id, name, displayName: name, number: `Nº${id}`, artworkUrl: `${id}.png` }
}

function detail(name: string, id: number): PokemonDetail {
  return {
    ...summary(name, id),
    types: ['grass'],
    weightKg: 6.9,
    heightM: 0.7,
    abilities: ['Overgrow'],
    stats: [{ name: 'hp', value: 45 }],
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.mocked(getIndex).mockReset()
  vi.mocked(getDetail).mockReset()
  vi.mocked(getSpecies).mockReset()
  vi.mocked(getTypeInfo).mockReset()
})

describe('loadIndex', () => {
  it('carga el índice y pasa por loading → ready', async () => {
    vi.mocked(getIndex).mockResolvedValue([summary('bulbasaur', 1)])
    const store = usePokemonStore()

    expect(store.indexStatus).toBe('idle')

    const promise = store.loadIndex()
    expect(store.indexStatus).toBe('loading')

    await promise

    expect(store.indexStatus).toBe('ready')
    expect(store.index).toEqual([summary('bulbasaur', 1)])
  })

  it('es idempotente: no repite el request si ya está listo', async () => {
    vi.mocked(getIndex).mockResolvedValue([summary('bulbasaur', 1)])
    const store = usePokemonStore()

    await store.loadIndex()
    await store.loadIndex()

    expect(getIndex).toHaveBeenCalledTimes(1)
  })

  it('marca error si falla, y permite reintentar', async () => {
    vi.mocked(getIndex).mockRejectedValueOnce(new Error('network'))
    const store = usePokemonStore()

    await store.loadIndex()
    expect(store.indexStatus).toBe('error')

    vi.mocked(getIndex).mockResolvedValueOnce([summary('bulbasaur', 1)])
    await store.loadIndex()

    expect(store.indexStatus).toBe('ready')
    expect(getIndex).toHaveBeenCalledTimes(2)
  })
})

describe('ensureDetails', () => {
  it('hidrata el detalle de los nombres pedidos', async () => {
    vi.mocked(getDetail).mockImplementation((name) => Promise.resolve(detail(name, 1)))
    const store = usePokemonStore()

    await store.ensureDetails(['bulbasaur'])

    expect(store.byName('bulbasaur')).toEqual(detail('bulbasaur', 1))
  })

  it('no repite el request de un nombre ya cacheado', async () => {
    vi.mocked(getDetail).mockImplementation((name) => Promise.resolve(detail(name, 1)))
    const store = usePokemonStore()

    await store.ensureDetails(['bulbasaur'])
    await store.ensureDetails(['bulbasaur'])

    expect(getDetail).toHaveBeenCalledTimes(1)
  })

  it('deduplica peticiones en vuelo para el mismo nombre', async () => {
    let resolveFetch!: (value: PokemonDetail) => void
    vi.mocked(getDetail).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve
        }),
    )
    const store = usePokemonStore()

    const first = store.ensureDetails(['bulbasaur'])
    const second = store.ensureDetails(['bulbasaur'])

    resolveFetch(detail('bulbasaur', 1))
    await Promise.all([first, second])

    expect(getDetail).toHaveBeenCalledTimes(1)
  })
})

describe('loadFullDetail', () => {
  it('mezcla detalle + species + debilidades cuando todo responde', async () => {
    vi.mocked(getDetail).mockResolvedValue(detail('bulbasaur', 1))
    vi.mocked(getSpecies).mockResolvedValue({ description: 'Una rara semilla', category: 'Semilla' })
    vi.mocked(getTypeInfo).mockResolvedValue({ weaknesses: ['fire', 'ice'], members: ['bulbasaur'] })
    const store = usePokemonStore()

    const result = await store.loadFullDetail('bulbasaur')

    expect(result?.description).toBe('Una rara semilla')
    expect(result?.category).toBe('Semilla')
    expect(result?.weaknesses).toEqual(['fire', 'ice'])
  })

  it('degrada solo la sección de species si falla, sin tumbar el resto', async () => {
    vi.mocked(getDetail).mockResolvedValue(detail('bulbasaur', 1))
    vi.mocked(getSpecies).mockRejectedValue(new Error('species down'))
    vi.mocked(getTypeInfo).mockResolvedValue({ weaknesses: ['fire'], members: ['bulbasaur'] })
    const store = usePokemonStore()

    const result = await store.loadFullDetail('bulbasaur')

    expect(result?.description).toBeUndefined()
    expect(result?.weaknesses).toEqual(['fire'])
    expect(result?.displayName).toBe('bulbasaur')
  })

  it('degrada solo las debilidades si falla ese endpoint', async () => {
    vi.mocked(getDetail).mockResolvedValue(detail('bulbasaur', 1))
    vi.mocked(getSpecies).mockResolvedValue({ category: 'Semilla' })
    vi.mocked(getTypeInfo).mockRejectedValue(new Error('type down'))
    const store = usePokemonStore()

    const result = await store.loadFullDetail('bulbasaur')

    expect(result?.category).toBe('Semilla')
    expect(result?.weaknesses).toBeUndefined()
  })

  it('devuelve undefined si el detalle base nunca llegó a cachearse', async () => {
    vi.mocked(getDetail).mockRejectedValue(new Error('detail down'))
    const store = usePokemonStore()

    const result = await store.loadFullDetail('bulbasaur')

    expect(result).toBeUndefined()
    expect(getSpecies).not.toHaveBeenCalled()
  })

  it('no pide debilidades si el Pokémon no tiene tipo primario', async () => {
    vi.mocked(getDetail).mockResolvedValue({ ...detail('missingno', 0), types: [] })
    vi.mocked(getSpecies).mockResolvedValue({})
    const store = usePokemonStore()

    const result = await store.loadFullDetail('missingno')

    expect(result?.weaknesses).toBeUndefined()
    expect(getTypeInfo).not.toHaveBeenCalled()
  })
})

describe('ensureTypeInfo', () => {
  it('cachea la info de un tipo y no repite el request', async () => {
    vi.mocked(getTypeInfo).mockResolvedValue({ weaknesses: ['fire'], members: ['bulbasaur'] })
    const store = usePokemonStore()

    await store.ensureTypeInfo(['grass'])
    await store.ensureTypeInfo(['grass'])

    expect(getTypeInfo).toHaveBeenCalledTimes(1)
    expect(store.typeInfo.get('grass')).toEqual({ weaknesses: ['fire'], members: ['bulbasaur'] })
  })

  it('la sirve loadFullDetail también, sin pedirla dos veces (mismo caché)', async () => {
    vi.mocked(getDetail).mockResolvedValue(detail('bulbasaur', 1))
    vi.mocked(getSpecies).mockResolvedValue({})
    vi.mocked(getTypeInfo).mockResolvedValue({ weaknesses: ['fire'], members: ['bulbasaur'] })
    const store = usePokemonStore()

    await store.ensureTypeInfo(['grass'])
    await store.loadFullDetail('bulbasaur') // mismo tipo primario: grass

    expect(getTypeInfo).toHaveBeenCalledTimes(1)
  })

  it('un tipo que falla no bloquea a los demás', async () => {
    vi.mocked(getTypeInfo).mockImplementation((type) =>
      type === 'fire'
        ? Promise.reject(new Error('down'))
        : Promise.resolve({ weaknesses: [], members: [] }),
    )
    const store = usePokemonStore()

    await store.ensureTypeInfo(['fire', 'water'])

    expect(store.typeInfo.has('fire')).toBe(false)
    expect(store.typeInfo.has('water')).toBe(true)
  })
})
