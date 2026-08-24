<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="stat-card">
    <span class="stat-card__label">{{ label }}</span>
    <span class="stat-card__value">{{ value }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

// En el diseño el borde encierra solo el valor: la etiqueta va afuera, encima.
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stat-card__label {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-caption;
  font-weight: tokens.$font-weight-medium;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.stat-card__value {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid tokens.$border;
  border-radius: 12px;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-body;
  font-weight: tokens.$font-weight-semibold;
  text-align: center;

  @include mixins.truncate;
}
</style>
