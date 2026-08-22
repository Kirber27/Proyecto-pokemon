<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/usePokemonStore'
import { useUiStore } from '@/stores/useUiStore'
import { useBreakpoint } from '@/composables/useBreakpoint'
import PokemonGrid from '@/components/pokemon/PokemonGrid.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import FilterSheet from '@/components/search/FilterSheet.vue'
import FilterSidebar from '@/components/search/FilterSidebar.vue'
import ResultsSummary from '@/components/search/ResultsSummary.vue'
import EmptyState from '@/components/feedback/EmptyState.vue'
import PokeballSpinner from '@/components/ui/PokeballSpinner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import type { PokemonType } from '@/types/domain'

const pokemonStore = usePokemonStore()
const uiStore = useUiStore()
const { isDesktop } = useBreakpoint()
const route = useRoute()
const router = useRouter()

const filterSheetOpen = ref(false)

// Idempotente: normalmente ya se cargó en el splash, pero un deep link directo a
// /pokedex (F5, onboarding ya visto) llega acá sin haber pasado por SplashView.
onMounted(() => {
  pokemonStore.loadIndex()

  // CA-03.4: hidrata búsqueda/filtro desde la URL (deep link / enlace compartido).
  const q = route.query.q
  if (typeof q === 'string' && q) uiStore.setQuery(q)

  const types = route.query.types
  if (typeof types === 'string' && types) {
    uiStore.setSelectedTypes(types.split(',') as PokemonType[])
  }
})

// CA-03.4: refleja búsqueda/filtro en la query string para poder compartir el enlace.
watch(
  () => [uiStore.query, [...uiStore.selectedTypes].join(',')] as const,
  ([q, types]) => {
    router.replace({ query: { q: q || undefined, types: types || undefined } })
  },
)

function onVisible(names: string[]): void {
  pokemonStore.ensureDetails(names)
}
</script>

<template>
  <div class="pokedex-view">
    <div class="pokedex-view__toolbar">
      <SearchBar :show-filter-button="!isDesktop" @toggle-filter="filterSheetOpen = true" />
    </div>

    <div
      v-if="pokemonStore.indexStatus === 'loading' || pokemonStore.indexStatus === 'idle'"
      class="pokedex-view__state"
    >
      <PokeballSpinner size="48px" />
    </div>

    <div v-else-if="pokemonStore.indexStatus === 'error'" class="pokedex-view__state">
      <p class="pokedex-view__error-text">Algo salió mal…</p>
      <AppButton @click="pokemonStore.loadIndex">Reintentar</AppButton>
    </div>

    <div v-else class="pokedex-view__body">
      <FilterSidebar v-if="isDesktop" class="pokedex-view__sidebar" />

      <div class="pokedex-view__main">
        <ResultsSummary />

        <EmptyState
          v-if="uiStore.visibleResults.length === 0"
          title="Sin resultados"
          :message="
            uiStore.query
              ? `No encontramos resultados para “${uiStore.query}”.`
              : 'Prueba con otro filtro.'
          "
        />

        <PokemonGrid
          v-else
          class="pokedex-view__grid"
          :items="uiStore.visibleResults"
          :details="pokemonStore.details"
          @visible="onVisible"
        />
      </div>
    </div>

    <FilterSheet v-if="!isDesktop" v-model:open="filterSheetOpen" />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.pokedex-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
}

.pokedex-view__toolbar {
  flex-shrink: 0;
  margin-bottom: 12px;
}

.pokedex-view__state {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.pokedex-view__error-text {
  margin: 0;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-body;
}

.pokedex-view__body {
  display: flex;
  flex: 1 1 auto;
  gap: 20px;
  min-height: 0;
}

.pokedex-view__sidebar {
  align-self: flex-start;
}

.pokedex-view__main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.pokedex-view__grid {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
