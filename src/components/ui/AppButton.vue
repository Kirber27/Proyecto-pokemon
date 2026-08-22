<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
  },
)
</script>

<template>
  <button :type="type" class="app-button" :class="`app-button--${variant}`" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: map.get(tokens.$spacers, 2);
  padding: map.get(tokens.$spacers, 3) map.get(tokens.$spacers, 6);
  border: 1px solid transparent;
  border-radius: tokens.$radius-pill;
  font-family: tokens.$font-family-base;
  font-size: tokens.$font-size-body;
  font-weight: tokens.$font-weight-semibold;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  @include mixins.focus-ring;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.app-button--primary {
  background-color: tokens.$primary;
  color: tokens.$surface;

  &:hover:not(:disabled) {
    background-color: tokens.$primary-hover;
  }
}

.app-button--secondary {
  background-color: transparent;
  border-color: tokens.$border;
  color: tokens.$text-primary;

  &:hover:not(:disabled) {
    background-color: tokens.$primary-soft;
    border-color: tokens.$primary;
  }
}
</style>
