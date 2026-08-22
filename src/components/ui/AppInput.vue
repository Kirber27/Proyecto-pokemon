<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    type: 'text',
    placeholder: undefined,
    disabled: false,
  },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    class="app-input"
  />
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.app-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid tokens.$border;
  border-radius: tokens.$radius-pill;
  background-color: tokens.$surface;
  color: tokens.$text-primary;
  font-family: tokens.$font-family-base;
  font-size: tokens.$font-size-body;

  @include mixins.focus-ring;

  &::placeholder {
    color: tokens.$text-secondary;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
