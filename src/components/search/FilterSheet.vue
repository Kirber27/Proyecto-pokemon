<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import AppButton from '@/components/ui/AppButton.vue'
import FilterTypeList from '@/components/search/FilterTypeList.vue'
import type { PokemonType } from '@/types/domain'

const open = defineModel<boolean>('open', { required: true })

const uiStore = useUiStore()
// Borrador local (CA-04.2): "Cancelar" descarta los cambios sin tocar el store.
const draft = ref<Set<PokemonType>>(new Set(uiStore.selectedTypes))

watch(open, (isOpen) => {
  if (isOpen) draft.value = new Set(uiStore.selectedTypes)
})

function apply(): void {
  uiStore.setSelectedTypes([...draft.value])
  open.value = false
}

function cancel(): void {
  open.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') cancel()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="filter-sheet__overlay" @click="cancel">
      <div
        class="filter-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Filtra por tus preferencias"
        @click.stop
        @keydown="onKeydown"
      >
        <div class="filter-sheet__handle" aria-hidden="true"></div>

        <div class="filter-sheet__header">
          <button type="button" class="filter-sheet__close" aria-label="Cerrar" @click="cancel">
            ✕
          </button>
          <h2 class="filter-sheet__title">Filtra por tus preferencias</h2>
        </div>

        <FilterTypeList v-model="draft" class="filter-sheet__content" />

        <div class="filter-sheet__actions">
          <AppButton variant="primary" @click="apply">Aplicar</AppButton>
          <AppButton variant="secondary" @click="cancel">Cancelar</AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.filter-sheet__overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  background-color: rgba(tokens.$text-primary, 0.4);
}

.filter-sheet {
  position: relative;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 12px 20px 20px;
  border-radius: tokens.$radius-sheet;
  background-color: tokens.$surface;
  box-shadow: tokens.$shadow-sheet;
  animation: sheet-slide-up 0.25s ease;
}

.filter-sheet__handle {
  width: 40px;
  height: 4px;
  margin: 0 auto 12px;
  border-radius: tokens.$radius-pill;
  background-color: tokens.$border;
}

.filter-sheet__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-sheet__close {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: none;
  color: tokens.$text-primary;
  font-size: 18px;
  cursor: pointer;

  @include mixins.focus-ring;
}

.filter-sheet__title {
  margin: 0;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-section-title;
  font-weight: tokens.$font-weight-semibold;
  text-align: center;
}

.filter-sheet__content {
  margin-bottom: 24px;
}

// FilterSheet solo se monta en mobile (PokedexView usa FilterSidebar en desktop),
// así que estos estilos no alcanzan al desktop.
.filter-sheet__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;

  :deep(.app-button) {
    width: 100%;
  }
}
</style>
