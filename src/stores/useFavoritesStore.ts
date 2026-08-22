import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { usePokemonStore } from '@/stores/usePokemonStore'

const STORAGE_KEY = 'pokedex:favorites'

function readStoredIds(): number[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === 'number')) {
      throw new Error('Formato de favoritos inválido')
    }

    return parsed
  } catch {
    // localStorage corrupto: se recupera con una lista vacía en vez de romper la app.
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const pokemonStore = usePokemonStore()

  const ids = ref<Set<number>>(new Set(readStoredIds()))

  const isFavorite = computed(() => (id: number) => ids.value.has(id))
  const count = computed(() => ids.value.size)
  const favoritePokemon = computed(() =>
    pokemonStore.index.filter((pokemon) => ids.value.has(pokemon.id)),
  )

  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids.value]))
  }

  function toggle(id: number): void {
    if (ids.value.has(id)) {
      ids.value.delete(id)
    } else {
      ids.value.add(id)
    }
    persist()
  }

  function remove(id: number): void {
    ids.value.delete(id)
    persist()
  }

  /** Re-lee localStorage — útil tras un cambio externo o para recuperarse de datos corruptos. */
  function hydrate(): void {
    ids.value = new Set(readStoredIds())
  }

  return {
    ids,
    isFavorite,
    count,
    favoritePokemon,
    toggle,
    remove,
    hydrate,
  }
})
