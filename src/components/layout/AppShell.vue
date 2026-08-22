<script setup lang="ts">
import { useBreakpoint } from '@/composables/useBreakpoint'
import TopNavBar from '@/components/layout/TopNavBar.vue'
import BottomTabBar from '@/components/layout/BottomTabBar.vue'
import PageContainer from '@/components/layout/PageContainer.vue'

const { isDesktop } = useBreakpoint()
</script>

<template>
  <div class="app-shell">
    <TopNavBar v-if="isDesktop" />

    <PageContainer class="app-shell__content">
      <slot />
    </PageContainer>

    <BottomTabBar v-if="!isDesktop" />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-shell__content {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
