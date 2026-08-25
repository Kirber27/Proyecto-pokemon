<script setup lang="ts">
import { ref } from 'vue'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import IconTrash from '@/assets/icons/IconTrash.vue'
import type { PokemonDetail, PokemonSummary } from '@/types/domain'

const props = defineProps<{
  summary: PokemonSummary
  detail?: PokemonDetail
}>()

const favoritesStore = useFavoritesStore()

// CA-06.4: en mobile, deslizar revela la acción de borrar (no borra al soltar);
// en desktop la misma acción aparece por CSS al hacer :hover/:focus-within.
const REVEAL_WIDTH = 72

const swipeOffset = ref(0)
let startX = 0
let dragging = false

function onTouchStart(event: TouchEvent): void {
  startX = event.touches[0]?.clientX ?? 0
  dragging = true
}

function onTouchMove(event: TouchEvent): void {
  if (!dragging) return

  const currentX = event.touches[0]?.clientX ?? startX
  const delta = currentX - startX
  swipeOffset.value = Math.min(0, Math.max(-REVEAL_WIDTH, delta))
}

function onTouchEnd(): void {
  dragging = false
  swipeOffset.value = swipeOffset.value < -REVEAL_WIDTH / 2 ? -REVEAL_WIDTH : 0
}

function remove(): void {
  favoritesStore.remove(props.summary.id)
}
</script>

<template>
  <div class="favorite-card">
    <div class="favorite-card__delete">
      <button
        type="button"
        class="favorite-card__delete-button"
        aria-label="Quitar de favoritos"
        @click="remove"
      >
        <IconTrash />
      </button>
    </div>

    <div
      class="favorite-card__content"
      :style="swipeOffset !== 0 ? { transform: `translateX(${swipeOffset}px)` } : undefined"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <PokemonCard :summary="summary" :detail="detail" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.favorite-card {
  position: relative;
  // Sin esto, al haber más favoritos de los que caben en el alto disponible,
  // el overflow:hidden de esta card (grid item) resuelve su min-height:auto
  // como 0 en vez de basarse en el contenido — la grilla comprime cada fila
  // muy por debajo de PokemonCard (180px) en lugar de simplemente scrollear.
  min-height: 180px;
  overflow: hidden;
  border-radius: tokens.$radius-card;
}

.favorite-card__delete {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  background-color: tokens.$danger;
}

.favorite-card__delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: tokens.$surface;
  color: tokens.$danger;
  cursor: pointer;

  @include mixins.focus-ring;
}

.favorite-card__content {
  position: relative;
  z-index: 1;
  background-color: tokens.$surface;
  transition: transform 0.2s ease;
  touch-action: pan-y;
}

// Desktop: sin gesto de swipe, la acción aparece al pasar el mouse o llegar por teclado.
.favorite-card:hover .favorite-card__content,
.favorite-card:focus-within .favorite-card__content {
  transform: translateX(-72px);
}
</style>
