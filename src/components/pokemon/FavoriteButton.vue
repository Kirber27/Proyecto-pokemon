<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import IconFavorites from '@/assets/icons/IconFavorites.vue'

const props = defineProps<{
  pokemonId: number
}>()

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.pokemonId))
const label = computed(() => (isFavorite.value ? 'Quitar de favoritos' : 'Añadir a favoritos'))

function toggle(): void {
  favoritesStore.toggle(props.pokemonId)
}
</script>

<template>
  <button
    type="button"
    class="favorite-button"
    :class="{ 'favorite-button--active': isFavorite }"
    :aria-pressed="isFavorite"
    :aria-label="label"
    @click="toggle"
  >
    <IconFavorites class="favorite-button__icon" />
  </button>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.favorite-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: tokens.$surface;
  color: tokens.$text-secondary;
  cursor: pointer;

  @include mixins.focus-ring;
}

.favorite-button--active {
  color: tokens.$danger;
}

.favorite-button__icon {
  width: 20px;
  height: 20px;
}

.favorite-button--active .favorite-button__icon {
  fill: currentColor;
  animation: favorite-pop 0.3s ease;
}

@keyframes favorite-pop {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
