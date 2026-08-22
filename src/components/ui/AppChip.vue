<script setup lang="ts">
withDefaults(
  defineProps<{
    selected?: boolean
  }>(),
  {
    selected: false,
  },
)
</script>

<template>
  <button type="button" class="app-chip" :class="{ 'app-chip--selected': selected }">
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.app-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid tokens.$border;
  border-radius: tokens.$radius-pill;
  background-color: var(--chip-bg, #{tokens.$surface});
  color: var(--chip-fg, #{tokens.$text-secondary});
  font-family: tokens.$font-family-base;
  font-size: tokens.$font-size-chip;
  font-weight: tokens.$font-weight-semibold;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  @include mixins.focus-ring;
}

.app-chip--selected {
  border-color: transparent;
  background-color: var(--chip-bg, #{tokens.$primary-soft});
  color: var(--chip-fg, #{tokens.$primary});
}
</style>
