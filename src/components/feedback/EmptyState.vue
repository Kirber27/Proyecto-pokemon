<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    message?: string
  }>(),
  {
    message: undefined,
  },
)
</script>

<template>
  <div class="empty-state">
    <svg class="empty-state__illustration" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6" />
      <path d="M34 48h28M48 34v28" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>

    <h2 class="empty-state__title">{{ title }}</h2>
    <p v-if="message" class="empty-state__message">{{ message }}</p>

    <div v-if="$slots.action" class="empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  text-align: center;
}

.empty-state__illustration {
  width: 72px;
  height: 72px;
  margin-bottom: 8px;
  color: tokens.$border;
}

.empty-state__title {
  margin: 0;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-section-title;
  font-weight: tokens.$font-weight-semibold;
}

.empty-state__message {
  max-width: 320px;
  margin: 0;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-body;
  line-height: tokens.$line-height-base;
}

.empty-state__action {
  margin-top: 8px;
}
</style>
