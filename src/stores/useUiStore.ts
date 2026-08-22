import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { usePokemonStore } from '@/stores/usePokemonStore'
import { matchesText } from '@/utils/textMatch'
import type { PokemonSummary, PokemonType } from '@/types/domain'

const ONBOARDING_STORAGE_KEY = 'pokedex:onboarding-seen'

/**
 * Estado de UI transversal: búsqueda, filtro por tipo y onboarding visto.
 * La sincronización con la query string (CA-03.4) vive en la capa de routing (Fase 4),
 * no acá: el store no depende de vue-router para seguir siendo testeable en aislado.
 */
export const useUiStore = defineStore('ui', () => {
  const pokemonStore = usePokemonStore()

  const query = ref('')
  const selectedTypes = ref<Set<PokemonType>>(new Set())
  const onboardingSeen = ref(localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1')

  // El filtro por tipo se resuelve exacto vía /type/{name} (design.md §5), no sobre
  // detalles hidratados: hace falta pedir la info de cada tipo recién seleccionado.
  watch(
    selectedTypes,
    (types) => {
      if (types.size > 0) pokemonStore.ensureTypeInfo([...types]).catch(() => {})
    },
    { deep: true },
  )

  function matchesQuery(item: PokemonSummary): boolean {
    return matchesText(item.displayName, query.value)
  }

  function matchesTypes(item: PokemonSummary): boolean {
    if (selectedTypes.value.size === 0) return true

    return [...selectedTypes.value].some((type) =>
      pokemonStore.typeInfo.get(type)?.members.includes(item.name),
    )
  }

  // CA-04.5: predicados en orden barato → caro. Sumar un filtro nuevo (favoritos,
  // generación…) es sumar un predicado acá; PokemonGrid/PokedexView no cambian.
  const filters = [matchesQuery, matchesTypes]

  const visibleResults = computed(() =>
    pokemonStore.index.filter((item) => filters.every((predicate) => predicate(item))),
  )

  function setQuery(value: string): void {
    query.value = value
  }

  function toggleType(type: PokemonType): void {
    if (selectedTypes.value.has(type)) {
      selectedTypes.value.delete(type)
    } else {
      selectedTypes.value.add(type)
    }
  }

  function setSelectedTypes(types: PokemonType[]): void {
    selectedTypes.value = new Set(types)
  }

  function clearTypes(): void {
    selectedTypes.value = new Set()
  }

  function markOnboardingSeen(): void {
    onboardingSeen.value = true
    localStorage.setItem(ONBOARDING_STORAGE_KEY, '1')
  }

  return {
    query,
    selectedTypes,
    onboardingSeen,
    visibleResults,
    setQuery,
    toggleType,
    setSelectedTypes,
    clearTypes,
    markOnboardingSeen,
  }
})
