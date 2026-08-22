import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import { usePokemonStore } from '@/stores/usePokemonStore'
import type { PokemonSummary } from '@/types/domain'

const STORAGE_KEY = 'pokedex:favorites'

function summary(id: number, name: string): PokemonSummary {
  return { id, name, displayName: name, number: `Nº${id}`, artworkUrl: `${id}.png` }
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('toggle / remove', () => {
  it('agrega y quita un id', () => {
    const store = useFavoritesStore()

    store.toggle(1)
    expect(store.isFavorite(1)).toBe(true)
    expect(store.count).toBe(1)

    store.toggle(1)
    expect(store.isFavorite(1)).toBe(false)
    expect(store.count).toBe(0)
  })

  it('remove quita el id aunque no estuviera marcado', () => {
    const store = useFavoritesStore()

    store.remove(1)

    expect(store.isFavorite(1)).toBe(false)
  })

  it('no duplica un id ya marcado', () => {
    const store = useFavoritesStore()

    store.toggle(1)
    store.toggle(2)

    expect(store.count).toBe(2)
  })
})

describe('favoritePokemon', () => {
  it('cruza los ids marcados con el índice del pokemonStore', () => {
    const pokemonStore = usePokemonStore()
    pokemonStore.index = [summary(1, 'bulbasaur'), summary(2, 'ivysaur'), summary(3, 'venusaur')]

    const favorites = useFavoritesStore()
    favorites.toggle(1)
    favorites.toggle(3)

    expect(favorites.favoritePokemon).toEqual([summary(1, 'bulbasaur'), summary(3, 'venusaur')])
  })
})

describe('persistencia', () => {
  it('sobrevive a un recargado de página (nueva instancia de store)', () => {
    const first = useFavoritesStore()
    first.toggle(1)
    first.toggle(25)

    setActivePinia(createPinia())
    const second = useFavoritesStore()

    expect(second.isFavorite(1)).toBe(true)
    expect(second.isFavorite(25)).toBe(true)
    expect(second.count).toBe(2)
  })

  it('guarda solo ids en localStorage', () => {
    const store = useFavoritesStore()
    store.toggle(1)

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([1])
  })
})

describe('recuperación ante datos corruptos', () => {
  it('arranca con lista vacía si localStorage tiene JSON inválido', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')

    const store = useFavoritesStore()

    expect(store.count).toBe(0)
  })

  it('arranca con lista vacía si el shape no es un array de números', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ids: [1, 2] }))

    const store = useFavoritesStore()

    expect(store.count).toBe(0)
  })

  it('hydrate() se recupera de datos corruptos sin romper', () => {
    const store = useFavoritesStore()
    store.toggle(1)

    localStorage.setItem(STORAGE_KEY, 'no-es-json')
    store.hydrate()

    expect(store.count).toBe(0)
  })
})
