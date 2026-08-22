<script setup lang="ts"></script>

<template>
  <div class="page-container">
    <div class="page-container__inner">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.page-container {
  min-height: 100%;
  background-color: tokens.$bg;

  @include mixins.media-up(lg) {
    background-color: tokens.$bg-desktop;
  }
}

.page-container__inner {
  margin-inline: auto;

  @include mixins.media-up(lg) {
    max-width: 1320px;
  }
}
</style>
