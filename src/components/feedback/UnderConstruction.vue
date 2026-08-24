<script setup lang="ts">
import EmptyState from '@/components/feedback/EmptyState.vue'
import jigglypuff from '@/assets/images/jigglypuff.png'

// Placeholder de las secciones que todavía no entran al MVP (Regiones, Perfil).
// La copia es fija: es el mismo mensaje para todas, y así ninguna vista puede
// inventar su propia versión del texto.
</script>

<template>
  <EmptyState
    class="under-construction"
    :image="jigglypuff"
    title="¡Muy pronto disponible!"
    message="Estamos trabajando para traerte esta sección. Vuelve más adelante para descubrir todas las novedades."
  />
</template>

<style scoped lang="scss">
// Ocupa el alto disponible para quedar centrado verticalmente, como en el diseño.
.under-construction {
  flex: 1 1 auto;
  justify-content: center;
}
</style>
