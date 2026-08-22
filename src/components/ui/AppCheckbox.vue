<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="app-checkbox" :class="{ 'app-checkbox--disabled': disabled }">
    <input v-model="model" type="checkbox" :disabled="disabled" class="app-checkbox__input" />
    <span class="app-checkbox__box" aria-hidden="true"></span>
    <span class="app-checkbox__label"><slot /></span>
  </label>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.app-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.app-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.app-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);

  &:focus-visible + .app-checkbox__box {
    outline: 2px solid tokens.$primary;
    outline-offset: 2px;
  }

  &:checked + .app-checkbox__box {
    border-color: tokens.$primary;
    background-color: tokens.$primary;

    &::after {
      opacity: 1;
    }
  }
}

.app-checkbox__box {
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: 1px solid tokens.$border;
  border-radius: 6px;
  background-color: tokens.$surface;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    width: 5px;
    height: 9px;
    border: solid tokens.$surface;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.1s ease;
  }
}

.app-checkbox__label {
  font-family: tokens.$font-family-base;
  font-size: tokens.$font-size-body;
  color: tokens.$text-primary;
}
</style>
