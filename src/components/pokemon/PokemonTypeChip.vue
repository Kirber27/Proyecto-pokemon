<script setup lang="ts">
import { typeNameEs } from '@/utils/formatters'
import type { PokemonType } from '@/types/domain'

defineProps<{
  type: PokemonType
}>()
</script>

<template>
  <span class="pokemon-type-chip" :data-type="type">{{ typeNameEs(type) }}</span>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.pokemon-type-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: tokens.$radius-pill;
  background-color: var(--type-chip-bg, #{tokens.$border});
  color: var(--type-chip-fg, #{tokens.$text-secondary});
  font-size: tokens.$font-size-chip;
  font-weight: tokens.$font-weight-semibold;

  @include mixins.type-theme-variants;
}
</style>
