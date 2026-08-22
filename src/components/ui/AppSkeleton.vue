<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
    radius?: string
  }>(),
  {
    width: '100%',
    height: '16px',
    radius: '8px',
  },
)
</script>

<template>
  <div
    class="app-skeleton"
    aria-hidden="true"
    :style="{ width, height, borderRadius: radius }"
  ></div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;

.app-skeleton {
  background: linear-gradient(
    90deg,
    #{tokens.$border} 25%,
    #{tokens.$bg-desktop} 37%,
    #{tokens.$border} 63%
  );
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
}
</style>
