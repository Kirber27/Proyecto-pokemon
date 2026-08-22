<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: string
  }>(),
  {
    size: '48px',
  },
)
</script>

<template>
  <span class="pokeball-spinner" role="status" :style="{ width: size, height: size }">
    <span class="pokeball-spinner__ball" aria-hidden="true">
      <span class="pokeball-spinner__band"></span>
      <span class="pokeball-spinner__button"></span>
    </span>
    <span class="visually-hidden">Cargando…</span>
  </span>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;

.pokeball-spinner {
  display: inline-block;
  position: relative;
}

.pokeball-spinner__ball {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    to bottom,
    tokens.$danger 0%,
    tokens.$danger 50%,
    tokens.$surface 50%,
    tokens.$surface 100%
  );
  border: 2px solid tokens.$text-primary;
  box-sizing: border-box;
  position: relative;
  animation: pokeball-spin 1s linear infinite;
}

.pokeball-spinner__band {
  position: absolute;
  left: -2px;
  right: -2px;
  top: calc(50% - 1px);
  height: 2px;
  background-color: tokens.$text-primary;
}

.pokeball-spinner__button {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30%;
  height: 30%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: tokens.$surface;
  border: 2px solid tokens.$text-primary;
  box-sizing: border-box;
}
</style>
