import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PokemonType } from '@/types/domain'

const ONBOARDING_STORAGE_KEY = 'pokedex:onboarding-seen'

/**
 * Estado de UI transversal: búsqueda, filtro por tipo y onboarding visto.
 * La sincronización con la query string (CA-03.4) vive en la capa de routing (Fase 4),
 * no acá: el store no depende de vue-router para seguir siendo testeable en aislado.
 */
export const useUiStore = defineStore('ui', () => {
  const query = ref('')
  const selectedTypes = ref<Set<PokemonType>>(new Set())
  const onboardingSeen = ref(localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1')

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
    setQuery,
    toggleType,
    setSelectedTypes,
    clearTypes,
    markOnboardingSeen,
  }
})
