<script setup lang="ts">
import UnderConstruction from '@/components/feedback/UnderConstruction.vue'
</script>

<template>
  <div class="regions-view">
    <!-- La sección no tiene encabezado visible en el diseño, pero la página sí
         necesita un h1 para no quedar sin título para lectores de pantalla. -->
    <h1 class="visually-hidden">Regiones</h1>
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
