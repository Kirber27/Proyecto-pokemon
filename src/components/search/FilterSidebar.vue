<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import FilterTypeList from '@/components/search/FilterTypeList.vue'
import type { PokemonType } from '@/types/domain'

const uiStore = useUiStore()

// CA-04.3: sin overlay, aplica en vivo — a diferencia de FilterSheet no hay borrador.
const selectedTypes = computed<Set<PokemonType>>({
  get: () => uiStore.selectedTypes,
  set: (value) => uiStore.setSelectedTypes([...value]),
})
</script>

<template>
  <aside class="filter-sidebar" aria-label="Filtrar por tipo">
    <FilterTypeList v-model="selectedTypes" />
  </aside>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;

.filter-sidebar {
  flex-shrink: 0;
  width: 280px;
  padding: 20px;
  border-radius: tokens.$radius-card;
  background-color: tokens.$surface;
  box-shadow: tokens.$shadow-card;
}
</style>
