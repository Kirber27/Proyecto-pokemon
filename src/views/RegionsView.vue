<script setup lang="ts">
import UnderConstruction from '@/components/feedback/UnderConstruction.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
</script>

<template>
  <div class="regions-view">
    <PageHeader title="Regiones" />
    <UnderConstruction />
  </div>
</template>

<style scoped lang="scss">
.regions-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
}
</style>
