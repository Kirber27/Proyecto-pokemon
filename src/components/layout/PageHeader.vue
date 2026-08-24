<script setup lang="ts">
import { useRouter } from 'vue-router'
import IconBack from '@/assets/icons/IconBack.vue'

defineProps<{
  title: string
}>()

const router = useRouter()

// Destino explícito y no router.back(): estas vistas son tabs de primer nivel, así que
// el historial puede estar vacío (deep link, F5) y volver atrás saldría de la app.
function goBack(): void {
  router.push({ name: 'pokedex' })
}
</script>

<template>
  <header class="page-header">
    <button type="button" class="page-header__back" aria-label="Volver" @click="goBack">
      <IconBack />
    </button>
    <h1 class="page-header__title">{{ title }}</h1>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

// El título va centrado y el botón anclado a la izquierda: por eso el botón sale del
// flujo, si no el título quedaría corrido por el ancho del botón.
.page-header {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  // Reserva el espacio del botón a ambos lados para que un título largo no se le encime.
  padding-inline: 44px;
  margin-bottom: 16px;
}

.page-header__back {
  position: absolute;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: tokens.$text-primary;
  cursor: pointer;

  @include mixins.focus-ring;
}

// IconBack no trae width/height propios: sin esto el svg se estira a los 36px del botón.
.page-header__back svg {
  width: 20px;
  height: 20px;
}

.page-header__title {
  margin: 0;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-section-title;
  font-weight: tokens.$font-weight-bold;
  text-align: center;
}
</style>
