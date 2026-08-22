<script setup lang="ts">
import { useClipboard } from '@/composables/useClipboard'
import { buildShareText } from '@/utils/shareText'
import IconShare from '@/assets/icons/IconShare.vue'
import type { PokemonDetail } from '@/types/domain'

const props = defineProps<{
  detail: PokemonDetail
}>()

const { copied, error, copy } = useClipboard()

function share(): void {
  copy(buildShareText(props.detail))
}
</script>

<template>
  <div class="share-button-wrapper">
    <button type="button" class="share-button" aria-label="Compartir" @click="share">
      <IconShare class="share-button__icon" />
    </button>

    <span v-if="copied" class="share-button__toast" role="status">¡Copiado!</span>
    <span v-if="error" class="share-button__toast share-button__toast--error" role="alert">
      No se pudo copiar
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.share-button-wrapper {
  position: relative;
  display: inline-flex;
}

.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: tokens.$surface;
  color: tokens.$text-primary;
  cursor: pointer;

  @include mixins.focus-ring;
}

.share-button__icon {
  width: 20px;
  height: 20px;
}

.share-button__toast {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  padding: 4px 10px;
  border-radius: tokens.$radius-pill;
  background-color: tokens.$text-primary;
  color: tokens.$surface;
  font-size: tokens.$font-size-caption;
  font-weight: tokens.$font-weight-medium;
  white-space: nowrap;
}

.share-button__toast--error {
  background-color: tokens.$danger;
}
</style>
