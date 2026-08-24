<script setup lang="ts">
import { computed } from 'vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import PokemonTypeChip from '@/components/pokemon/PokemonTypeChip.vue'
import FavoriteButton from '@/components/pokemon/FavoriteButton.vue'
import { POKEMON_CARD_HEIGHT } from '@/components/pokemon/gridLayout'
import type { PokemonDetail, PokemonSummary } from '@/types/domain'

const props = defineProps<{
  summary: PokemonSummary
  detail?: PokemonDetail
}>()

const primaryType = computed(() => props.detail?.types[0])
</script>

<template>
  <div
    class="pokemon-card"
    :data-type="primaryType"
    :style="{ height: `${POKEMON_CARD_HEIGHT}px` }"
  >
    <RouterLink
      :to="{ name: 'pokedex-detail', params: { name: summary.name } }"
      class="pokemon-card__link"
    >
      <div class="pokemon-card__info">
        <span class="pokemon-card__number">{{ summary.number }}</span>
        <h3 class="pokemon-card__name">{{ summary.displayName }}</h3>

        <div class="pokemon-card__types">
          <template v-if="detail">
            <PokemonTypeChip v-for="type in detail.types" :key="type" :type="type" />
          </template>
          <template v-else>
            <AppSkeleton width="56px" height="22px" radius="999px" />
            <AppSkeleton width="56px" height="22px" radius="999px" />
          </template>
        </div>
      </div>

      <div class="pokemon-card__art">
        <img
          :src="summary.artworkUrl"
          :alt="summary.displayName"
          class="pokemon-card__sprite"
          loading="lazy"
          decoding="async"
          width="96"
          height="96"
        />
      </div>
    </RouterLink>

    <FavoriteButton :pokemon-id="summary.id" class="pokemon-card__favorite" />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.pokemon-card {
  position: relative;
  border-radius: tokens.$radius-card;
  background-color: var(--type-art-from, #{tokens.$surface});
  box-shadow: tokens.$shadow-card;
  overflow: hidden;

  @include mixins.type-theme-variants;
}

.pokemon-card__link {
  display: flex;
  height: 100%;
  color: inherit;
  text-decoration: none;

  @include mixins.focus-ring;
}

.pokemon-card__info {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  padding: 16px;
}

.pokemon-card__number {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-caption;
  font-weight: tokens.$font-weight-medium;
}

.pokemon-card__name {
  margin: 0;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-card-name;
  font-weight: tokens.$font-weight-bold;

  @include mixins.truncate;
}

.pokemon-card__types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pokemon-card__art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40%;
  border-radius: tokens.$radius-art;
  background-color: var(--type-art-to, #{tokens.$bg-desktop});
}

.pokemon-card__sprite {
  width: 96px;
  height: 96px;
  object-fit: contain;
}

.pokemon-card__favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}
</style>
