<script setup lang="ts">
import AppCheckbox from '@/components/ui/AppCheckbox.vue'
import { typeNameEs } from '@/utils/formatters'
import { ALL_POKEMON_TYPES, type PokemonType } from '@/types/domain'

const model = defineModel<Set<PokemonType>>({ required: true })

function toggle(type: PokemonType, checked: boolean): void {
  const next = new Set(model.value)
  if (checked) {
    next.add(type)
  } else {
    next.delete(type)
  }
  model.value = next
}
</script>

<template>
  <fieldset class="filter-type-list">
    <legend class="filter-type-list__legend">Tipo</legend>

    <AppCheckbox
      v-for="type in ALL_POKEMON_TYPES"
      :key="type"
      :model-value="model.has(type)"
      class="filter-type-list__item"
      @update:model-value="(checked) => toggle(type, checked)"
    >
      {{ typeNameEs(type) }}
    </AppCheckbox>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;

.filter-type-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
  margin: 0;
  padding: 0;
  border: none;
}

.filter-type-list__legend {
  grid-column: 1 / -1;
  padding: 0;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-section-title;
  font-weight: tokens.$font-weight-semibold;
}
</style>
