<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()

const hasActiveFilters = computed(() => uiStore.selectedTypes.size > 0)
</script>

<template>
  <div v-if="hasActiveFilters" class="results-summary">
    <span class="results-summary__count">
      Se han encontrado {{ uiStore.visibleResults.length }} resultados
    </span>
    <button type="button" class="results-summary__clear" @click="uiStore.clearTypes">
      Borrar filtro
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.results-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
}

.results-summary__count {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-body;
}

.results-summary__clear {
  border: none;
  background: none;
  color: tokens.$primary;
  font-size: tokens.$font-size-body;
  font-weight: tokens.$font-weight-semibold;
  cursor: pointer;

  @include mixins.focus-ring;
}
</style>
