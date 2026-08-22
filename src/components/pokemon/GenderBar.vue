<script setup lang="ts">
import type { GenderRatio } from '@/types/domain'

defineProps<{
  ratio: GenderRatio
}>()
</script>

<template>
  <div class="gender-bar">
    <div class="gender-bar__track" role="img" :aria-label="`${Math.round(ratio.male)}% macho, ${Math.round(ratio.female)}% hembra`">
      <div class="gender-bar__male" :style="{ width: `${ratio.male}%` }"></div>
      <div class="gender-bar__female" :style="{ width: `${ratio.female}%` }"></div>
    </div>
    <div class="gender-bar__labels" aria-hidden="true">
      <span class="gender-bar__label gender-bar__label--male">♂ {{ Math.round(ratio.male) }}%</span>
      <span class="gender-bar__label gender-bar__label--female">♀ {{ Math.round(ratio.female) }}%</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;

.gender-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gender-bar__track {
  display: flex;
  height: 8px;
  overflow: hidden;
  border-radius: tokens.$radius-pill;
  background-color: tokens.$border;
}

.gender-bar__male {
  background-color: tokens.$gender-male;
}

.gender-bar__female {
  background-color: tokens.$gender-female;
}

.gender-bar__labels {
  display: flex;
  justify-content: space-between;
  font-size: tokens.$font-size-caption;
  font-weight: tokens.$font-weight-medium;
}

.gender-bar__label--male {
  color: tokens.$gender-male;
}

.gender-bar__label--female {
  color: tokens.$gender-female;
}
</style>
