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
@use 'sass:color';
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.favorite-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  // El botón va sobre el arte del Pokémon: anillo blanco para despegarlo del fondo
  // y relleno translúcido para atenuarlo sin taparlo. box-sizing global es
  // border-box (reboot de Bootstrap), así que el borde no agranda el círculo.
  border: 3px solid tokens.$surface;
  border-radius: 50%;
  background-color: color.change(tokens.$text-primary, $alpha: 0.35);
  color: tokens.$surface;
  cursor: pointer;

  @include mixins.focus-ring;
}

// Marcado: solo cambia el corazón a rojo pleno; el círculo se mantiene igual.
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
