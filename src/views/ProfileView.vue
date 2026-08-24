<script setup lang="ts">
import UnderConstruction from '@/components/feedback/UnderConstruction.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
</script>

<template>
  <div class="profile-view">
    <PageHeader title="Perfil" />
    <UnderConstruction />
  </div>
</template>

<style scoped lang="scss">
.profile-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
}
</style>
