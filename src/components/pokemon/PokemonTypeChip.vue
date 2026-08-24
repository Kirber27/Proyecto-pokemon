<script setup lang="ts">
import { TYPE_ICONS } from '@/assets/types'
import { typeNameEs } from '@/utils/formatters'
import type { PokemonType } from '@/types/domain'

defineProps<{
  type: PokemonType
}>()
</script>

<template>
  <span class="pokemon-type-chip" :data-type="type">
    <span class="pokemon-type-chip__badge" aria-hidden="true">
      <img :src="TYPE_ICONS[type]" alt="" class="pokemon-type-chip__icon" />
    </span>
    {{ typeNameEs(type) }}
  </span>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.pokemon-type-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 3px;
  border-radius: tokens.$radius-pill;
  background-color: var(--type-solid, #{tokens.$border});
  color: tokens.$surface;
  font-size: tokens.$font-size-chip;
  font-weight: tokens.$font-weight-semibold;

  @include mixins.type-theme-variants;
}

// Disco blanco detrás del glifo: el ícono trae su propio color, que es el mismo del
// fondo del chip, así que sin este contraste se perdería contra él.
.pokemon-type-chip__badge {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: tokens.$surface;
}

.pokemon-type-chip__icon {
  width: 11px;
  height: 11px;
  object-fit: contain;
}
</style>
